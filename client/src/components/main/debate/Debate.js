import { useEffect, useCallback, useRef, useState, memo } from "react";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { debateRoomsSelectorFamily } from "stores/debateRoomStates";
import styled from "styled-components" 

import People from "assets/icons/People.png";

import NoImageAvailable from "assets/icons/No_Image_Available.png";
import RoomInfo from "./RoomInfo";
import { joinModalState } from "stores/ModalStates";
import { useNavigate } from "react-router-dom";

function Debate({ visibleCounts, roomInfo, type, itemIdx, currSlideIdx }) {

  const navigate = useNavigate();
  const setDebateRoom = useSetRecoilState(debateRoomsSelectorFamily(roomInfo.roomId));
  const resetDebateRoom = useResetRecoilState(debateRoomsSelectorFamily(roomInfo.roomId));

  const { 
    roomId, 
    roomName: title,
    roomOpinionLeft: leftOpinion,
    roomOpinionRight: rightOpinion,
    roomWatchCnt: viewers,
    roomPhase: phases,
    roomPhaseCurrentTimeMinute: minutes,
    roomPhaseCurrentTimeSecond: seconds,
    roomThumbnailUrl: imageUrl = NoImageAvailable,
  } = roomInfo;

  const to_02d = (value) => value < 10 ? "0" + value : value;

  useEffect(() => {
    setDebateRoom(roomInfo)

    return (() => {
        resetDebateRoom();
    })
}, [resetDebateRoom, setDebateRoom, roomInfo])

  // 호버 체크
  const [isHovered, setIsHovered] = useState(false);

  // 모달
  const setJoinModalState = useSetRecoilState(joinModalState);
  const HandleDebateClick = () => {
    console.log("clicked debate type >> ", type);
    if (type === "waiting") {
      setJoinModalState({ roomId: roomId, isModalOpen: true})
    } else {
      if (window.confirm(`"${title}" 방에 입장하시겠습니까?`)) {
        navigate(`/debate/room/${roomId}`)
      }
    }
  }

  // 타이머
  const interval = useRef(null);
  const [secondsState, setSecondsState] = useState(seconds);
  const [minutesState, setMinutesState] = useState(minutes);

  useEffect(() => {
      interval.current = setInterval(() => {
      if (secondsState === 59) {
          setMinutesState(current => current + 1);
          setSecondsState(0);
      } else {
          setSecondsState(current => current + 1);
      }
      }, 1000);
      return () => clearInterval(interval.current);
  }, [secondsState]);

  return (

    <Wrapper 
    visibleCounts={visibleCounts} 
    viewers={viewers} 
    >
      <ThumbnailInfoWrapper
        isHovered={isHovered}
        itemIdx={itemIdx} 
        visibleCounts={visibleCounts} 
        currSlideIdx={currSlideIdx}
        >
        <StyledThumbnail 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={HandleDebateClick}
        >  
          {/* 배경 이미지 및 반투명 검은 배경 */}
          <StyledBackgroundImage src={imageUrl} />
          <HalfClearBlack />

          {/* 방제 */}
          <Title type={type} title={title}>
          {title}
          </Title>

          {/* 중앙부 대립 의견 */}
          <Center type={type}>
            {/* 왼쪽 의견 */}
            <Opinion type={type} title={leftOpinion}>{leftOpinion}</Opinion>

            {/* VS */}
            <Versus type={type}>VS</Versus>

            {/* 오른쪽 의견 */}
            <Opinion type={type} title={rightOpinion}>{rightOpinion}</Opinion>
          </Center>
          
          {/* 하단부 시청자 및 페이즈 정보 */}
          <Footer>
            {/* 시청자 */}
            <FooterInfo>
                <ViewersIcon type={type} src={People} />
                <StyledFont type={type}>{viewers}</StyledFont>
                <StyledFont type={type}>명</StyledFont>
            </FooterInfo>

            {/* 페이즈 */}
            <FooterInfo>
                <StyledFont type={type}>{phases}</StyledFont>
                <StyledFont type={type}>&nbsp;페이즈&nbsp;</StyledFont>
                <StyledFont type={type}>{to_02d(minutesState)}</StyledFont>
                <StyledFont type={type}>&nbsp;:&nbsp;</StyledFont>
                <StyledFont type={type}>{to_02d(secondsState)}</StyledFont>
            </FooterInfo>
          </Footer>
        </StyledThumbnail>
        {isHovered
        ? <RoomInfo roomId={roomId} type={type}/>
        : null}

      </ThumbnailInfoWrapper>
    </Wrapper>
  )
}

export default memo(Debate);

const Wrapper = styled.div`
  position: relative;
  flex: 0 0 ${props => 100 / props.visibleCounts}%;
  max-width: ${props => 100 / props.visibleCounts}%;
  min-width: 4rem;
  
  aspect-ratio: 16 / 9;
  padding: .25rem;
  box-sizing: border-box;
  /* border: 1px solid red; */
`

const ThumbnailInfoWrapper = styled.div`
  position: relative;
  background-color: #FFFFFF;
  box-sizing: border-box;
  cursor: pointer;
  width: 100%;
  height: 100%;
  transition: transform 0.35s ease-in-out, transform-origin 0.35s 0.1s;
  &:hover {
    ${props => {
      if ((props.itemIdx - props.currSlideIdx) % props.visibleCounts === 0) {
        console.log("왼쪽위")
        return "transform-origin: 0% 0%; transform: scale(1.15);"
      } else if ((props.itemIdx - props.currSlideIdx) === props.visibleCounts-1) {
        console.log("오른쪽위")
        return "transform-origin: 111% 0%; transform: scale(1.15);"
      } else {
        console.log("중간")
        return "transform-origin: 50% 0; transform: scale(1.15);"
      }
    }}
    position: absolute;
    z-index: 2;
  }

`;

const StyledThumbnail = styled.div`
  width: 100%;
  height: 100%;
  /* aspect-ratio: 16 / 9; */
  /* border: 1px solid red; */

  // 얘가 원인이었음
  /* display: inline-block; */ 

  box-sizing: border-box;
  overflow: hidden;
  /* margin: 0 auto; */
`;

const StyledBackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  /* aspect-ratio: 16 / 9; */

  // 얘가 빌런?
  /* position: absolute; */

  // fit
  object-fit: cover;                  
  
  /* transform: scale(1); */
`;

const HalfClearBlack = styled.div`
  // 크기 설정
  width: 100%;
  height: 100%;
  /* aspect-ratio: 16 / 9; */
  
  // 검은색 배경에 투명도 50%
  background-color: #000000;
  opacity: 0.5;

  // 위치 설정
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
`;

const Title = styled.p`
  // 크기 설정
  width: 90%;
  
  // 마진 설정
  margin: 8px 5%;

  // 글꼴 설정
  color: #FFFFFF;
  text-align: center;
  ${({ type }) => type === "hot-thumbnail"
  ? "font-size: calc(0.75rem + 1.5vw);" // "font-size: 2.4rem;"
  : "font-size: calc(0.5rem + 1.25vw);"};
  font-weight: 700;
  letter-spacing: -0.05rem;

  // 초과 글자 처리
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  // 위치 설정
  position: absolute;
  top: 0;
  left: 0;

  @media screen and (max-width: 1024px) {
    ${({ type }) => type === "hot-thumbnail"
  ? "font-size: 1.8rem;"
  : "font-size: 1.2rem;"};
  }
`;

const Center = styled.div`
  // 크기 설정
  width: 100%;
  ${({ type }) => type === "hot-thumbnail"
    ? "height: calc( 100% - 69px - 37px ); margin: 69px 0 37px 0;"
    : "height: calc( 100% - 54px - 32px ); margin: 54px 0 32px 0;"}

  // display 설정, 수직 가운데 정렬
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: -0.05rem;

  // 글자 크기 설정
  ${({ type }) => type === "hot-thumbnail"
    ? "font-size: calc(0.75rem + 1vw);" // "font-size: 2rem;"
    : "font-size: calc(0.5rem + 0.75vw);"}

  // 위치 설정
  position: absolute;
  left: 0;
  bottom: 0;

  @media screen and (max-width: 1024px) {
    ${({ type }) => type === "hot-thumbnail"
  ? "font-size: 1.8rem;"
  : "font-size: 1.2rem;"};
  }
`;
const Opinion = styled.p`
  width: calc( 45% - 16px );
  margin: 0;
  padding: 0 8px;

  // 글꼴 설정
  color: #FFFFFF;
  text-align: center;

  // 글자 초과 처리
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Versus = styled.p`
  margin: 0;

  // 글꼴 설정
  color: #FFFFFF;
  text-align: center;
  font-weight: 700;
`;

// 하단부 Wrapper, 시청자수 및 페이즈 정보
const Footer = styled.div`
  // 크기 설정
  width: calc( 100% - 16px );

  // 패딩 설정
  padding: 8px;

  // display 설정
  display: flex;
  justify-content: space-between;
  align-items: center;

  // 위치 설정
  position: absolute;
  left: 0;
  bottom: 0;
`;
// Wrapper에 들어갈 정보 (시청자수 또는 페이즈 정보)
const FooterInfo = styled.div`
  // 수직 가운데 정렬
  display: flex;
  align-items: center;
`;
// 시청자 아이콘
const ViewersIcon = styled.img`
  ${({ type }) => type === "hot-thumbnail"
    ? "width: 20px; height: 20px;"
    : "width: 15px; height: 15px;"}
`;
// Footer에 들어갈 정보의 글꼴
const StyledFont = styled.span`
  // 글꼴 설정
  color: #FFFFFF;
  ${({ type }) => type === "hot-thumbnail"
    ? "font-size: 0.5rem;"
    : "font-size: 0.25rem;"}
`;
