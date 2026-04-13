// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    CheckIn public c;
    address alice = address(0xA11ce);

    function setUp() public {
        vm.warp(1_700_000_000); // non-zero day index (avoid today == last == 0)
        c = new CheckIn();
    }

    function test_checkIn_revertsWithValue() public {
        vm.expectRevert(CheckIn.NoValueAllowed.selector);
        c.checkIn{value: 1 wei}();
    }

    function test_checkIn_twiceSameDay_reverts() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
        vm.stopPrank();
    }

    function test_checkIn_emitsAndSetsStreak() public {
        vm.startPrank(alice);
        uint256 day0 = block.timestamp / 1 days;
        vm.expectEmit(true, true, true, true);
        emit CheckIn.CheckedIn(alice, day0, 1);
        c.checkIn();
        assertEq(c.lastCheckInDayIndex(alice), day0);
        assertEq(c.streakCount(alice), 1);
        vm.stopPrank();
    }

    function test_checkIn_nextDay_incrementsStreak() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.warp(block.timestamp + 1 days);
        uint256 day1 = block.timestamp / 1 days;
        vm.expectEmit(true, true, true, true);
        emit CheckIn.CheckedIn(alice, day1, 2);
        c.checkIn();
        assertEq(c.streakCount(alice), 2);
        vm.stopPrank();
    }

    function test_checkIn_skipDay_resetsStreak() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.warp(block.timestamp + 2 days);
        c.checkIn();
        assertEq(c.streakCount(alice), 1);
        vm.stopPrank();
    }
}
