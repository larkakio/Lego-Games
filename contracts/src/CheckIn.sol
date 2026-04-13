// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Daily check-in on Base. One successful call per UTC calendar day. No ETH accepted.
contract CheckIn {
    mapping(address => uint256) public lastCheckInDayIndex;
    mapping(address => uint256) public streakCount;

    event CheckedIn(address indexed user, uint256 dayIndex, uint256 streak);

    error NoValueAllowed();
    error AlreadyCheckedInToday();

    function checkIn() external payable {
        if (msg.value != 0) revert NoValueAllowed();

        uint256 today = block.timestamp / 1 days;
        uint256 last = lastCheckInDayIndex[msg.sender];

        if (last == today) revert AlreadyCheckedInToday();

        uint256 streak = 1;
        if (last != 0 && today == last + 1) {
            streak = streakCount[msg.sender] + 1;
        }

        lastCheckInDayIndex[msg.sender] = today;
        streakCount[msg.sender] = streak;

        emit CheckedIn(msg.sender, today, streak);
    }
}
