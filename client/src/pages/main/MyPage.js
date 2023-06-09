import ShowInformation from "components/main/mypage/ShowInformation";
import SideNav from "components/main/mypage/SideNav";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { showPageState } from "stores/myPageStates";
import styled from "styled-components";

const MyPageContainer = styled.div`
  // 크기 설정
  width: 100%;

  // 위치 관계
  position: relative;

  // Display
  display: flex;
`;

const SideNavContainer = styled.div`
  // 크기 설정
  min-width: 200px;
  width: 15%;
  
  // 위치 설정, 고정형
  position: absolute;
  top: -64px;
  left: 0;
  right: 0;
  bottom: calc( -100vh + 64px );

  // 디자인
  box-shadow: 1px 1px 1px 1px #DCDCDC;

  // Display
  display: inline-block;
`;

const InformationContainer = styled.div`
  // 크기 설정
  width: 85%;
  max-width: calc( 100% - 200px );
  height: calc( 100vh - 64px );

  // 위치 설정
  position: absolute;
  top: 0;
  right: 0;

  // Display
  display: inline-block;
  
  // Overflow
  overflow: auto;
`;

function MyPage() {
  const [showPage, setShowPage] = useRecoilState(showPageState);

  // 마이페이지 접근 시 내 개인정보를 우선으로 보여주기
  useEffect(() => {
    setShowPage("MyInfo");
  }, []);

  return (
    <MyPageContainer>
      <SideNavContainer>
        <SideNav />
      </SideNavContainer>

      <InformationContainer>
        <ShowInformation />
      </InformationContainer>
    </MyPageContainer>
  );
}

export default MyPage;