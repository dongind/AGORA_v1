package com.agora.server.room.util;

import org.springframework.stereotype.Component;

@Component
public class RedisMessageUtil {

    /**
     * 태그 규칙
     * <p>
     * [이벤트태그] [파라미터태그1] [파라미터태그2] ... parameter1 parameter2 ...
     * ex) [ENTER] [TEAM] [USERNICKNAME] LEFT 김영한
     * 왼쪽팀의 김영한님이 방에 입장함을 알리는 태그
     *
     * 공백 기준으로 스플릿 하실 수 있게 해놨습니다
     */

    // 이벤트 태그
    private final String DEBATE_START_TAG = "[DEBATESTART] ";
    private final String DEBATE_END_TAG = "[DEBATEEND] ";
    private final String ENTER_TAG = "[ENTER] ";
    private final String LEAVE_TAG = "[LEAVE] ";
    private final String READY_TAG = "[READY] ";
    private final String UNREADY_TAG = "[UNREADY] ";
    private final String PHASE_START_TAG = "[PHASESTART] ";
    private final String PHASE_END_TAG = "[PHASEEND] ";
    private final String PHASE_SKIP_TAG = "[PHASESKIP] ";
    private final String VOTE_START_TAG = "[VOTESTART] ";
    private final String VOTE_END_TAG = "[VOTEEND] ";

    // 파라미터 태그
    private final String NICKNAME_TAG = "[NICKNAME] ";
    private final String DEBATE_PHASE_TAG = "[DEBATEPHASE] ";
    private final String VOTE_PHASE_TAG = "[VOTEPHASE] ";
    private final String VOTE_RESULT_TAG = "[VOTERESULT] ";
    private final String TURN_TAG = "[TURN] ";
    private final String TEAM_TAG = "[TEAM] ";

    public String enterMessage(Integer userSide, String userNickname) {
        String team = getTeam(userSide);
        return ENTER_TAG + TEAM_TAG + NICKNAME_TAG + team + " " + userNickname;
    }

    public String leaveMessage(Integer userSide, String userNickname) {
        String team = getTeam(userSide);
        return LEAVE_TAG + TEAM_TAG + NICKNAME_TAG + team + " " + userNickname;
    }

    public String readyMessage(Integer userSide, String userNickname) {
        String team = getTeam(userSide);
        return READY_TAG + TEAM_TAG + NICKNAME_TAG + team + " " + userNickname;
    }

    public String unreadyMessage(Integer userSide, String userNickname) {
        String team = getTeam(userSide);
        return UNREADY_TAG + TEAM_TAG + NICKNAME_TAG + team + " " + userNickname;
    }

    public String debateStartMessage() {
        return DEBATE_START_TAG + "start debate";
    }

    public String phaseStartAllInOneMessage(Integer phase, Integer turn, String team, String userNickname) {
        return PHASE_START_TAG + DEBATE_PHASE_TAG + TURN_TAG + TEAM_TAG + NICKNAME_TAG + phase + " " + turn + " " + team + " " + userNickname;
    }

    public String phaseEndAllInOneMessage(Integer phase, Integer turn, String team, String userNickname) {
        return PHASE_END_TAG + DEBATE_PHASE_TAG + TURN_TAG + TEAM_TAG + NICKNAME_TAG + phase + " " + turn + " " + team + " " + userNickname;
    }

    public String phaseSkipAllInOneMessage(Integer phase, Integer turn, String team, String userNickname) {
        return PHASE_SKIP_TAG + DEBATE_PHASE_TAG + TURN_TAG + TEAM_TAG + NICKNAME_TAG  + phase + " " + turn + " " + team + " " + userNickname;
    }

    public String voteStartMessage(Integer votePhase) {
        return VOTE_START_TAG + VOTE_PHASE_TAG + votePhase;
    }

    public String voteEndMessage(Integer votePhase, Integer voteLeftResult, Integer voteRightResult) {
        return VOTE_END_TAG + VOTE_PHASE_TAG +VOTE_RESULT_TAG + votePhase + " " + voteLeftResult + " " + voteRightResult;
    }
    public String debateEndMessage() {
        return DEBATE_END_TAG + "debate ended please leave room";
    }

    /**
     * 편의용 메서드
     * 팀 태그
     *
     * @param userSide
     * @return
     */
    private String getTeam(Integer userSide) {
        if (userSide == 0) {
            return "LEFT";
        } else if (userSide == 1) {
            return "RIGHT";
        } else {
            return "NOSIDE";
        }
    }

}