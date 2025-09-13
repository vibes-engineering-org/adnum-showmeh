// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CastJackpot is ReentrancyGuard, Ownable {
    IERC20 public immutable usdc;
    
    uint256 public constant ENTRY_FEE = 100000; // 0.1 USDC (6 decimals)
    uint256 public totalJackpot;
    uint256 public currentRound;
    
    mapping(uint256 => address[]) public roundEntries;
    mapping(uint256 => mapping(address => bool)) public hasEntered;
    mapping(uint256 => address) public winners;
    mapping(uint256 => uint256) public roundJackpots;
    
    event EntryPaid(address indexed user, uint256 round, uint256 amount);
    event WinnerSelected(address indexed winner, uint256 round, uint256 amount);
    event RoundStarted(uint256 round);
    
    constructor(address _usdc) {
        usdc = IERC20(_usdc);
        currentRound = 1;
        emit RoundStarted(1);
    }
    
    function enterJackpot() external nonReentrant {
        require(!hasEntered[currentRound][msg.sender], "Already entered this round");
        
        require(usdc.transferFrom(msg.sender, address(this), ENTRY_FEE), "USDC transfer failed");
        
        roundEntries[currentRound].push(msg.sender);
        hasEntered[currentRound][msg.sender] = true;
        totalJackpot += ENTRY_FEE;
        roundJackpots[currentRound] += ENTRY_FEE;
        
        emit EntryPaid(msg.sender, currentRound, ENTRY_FEE);
    }
    
    function drawWinner() external onlyOwner {
        require(roundEntries[currentRound].length > 0, "No entries");
        
        uint256 winnerIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            roundEntries[currentRound].length
        ))) % roundEntries[currentRound].length;
        
        address winner = roundEntries[currentRound][winnerIndex];
        uint256 jackpotAmount = roundJackpots[currentRound];
        
        winners[currentRound] = winner;
        
        require(usdc.transfer(winner, jackpotAmount), "Winner payout failed");
        
        emit WinnerSelected(winner, currentRound, jackpotAmount);
        
        // Start new round
        currentRound++;
        emit RoundStarted(currentRound);
    }
    
    function getCurrentRoundEntries() external view returns (uint256) {
        return roundEntries[currentRound].length;
    }
    
    function getCurrentJackpot() external view returns (uint256) {
        return roundJackpots[currentRound];
    }
    
    function getUserEntryStatus(address user) external view returns (bool) {
        return hasEntered[currentRound][user];
    }
}