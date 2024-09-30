// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessControl is Ownable {
    // Mapping to track admin addresses
    mapping(address => bool) private admins;

    // Mapping to track content creator addresses
    mapping(address => bool) private contentCreators;

    // Events
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event ContentCreatorAdded(address indexed creator);
    event ContentCreatorRemoved(address indexed creator);

    // Modifier to allow only admins to perform certain actions
    modifier onlyAdmin() {
        require(admins[msg.sender], "AccessControl: Caller is not an admin");
        _;
    }

    // Modifier to allow only content creators to perform certain actions
    modifier onlyContentCreator() {
        require(
            contentCreators[msg.sender],
            "AccessControl: Caller is not a content creator"
        );
        _;
    }
constructor() Ownable() {
    // Owner is the default admin
    admins[msg.sender] = true;
    emit AdminAdded(msg.sender);
}

    // Function to add a new admin (onlyOwner)
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "AccessControl: Invalid admin address");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    // Function to remove an admin (onlyOwner)
    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "AccessControl: Address is not an admin");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    // Function to add a content creator (onlyAdmin)
    function addContentCreator(address _creator) external onlyAdmin {
        require(
            _creator != address(0),
            "AccessControl: Invalid creator address"
        );
        contentCreators[_creator] = true;
        emit ContentCreatorAdded(_creator);
    }

    // Function to remove a content creator (onlyAdmin)
    function removeContentCreator(address _creator) external onlyAdmin {
        require(
            contentCreators[_creator],
            "AccessControl: Address is not a content creator"
        );
        contentCreators[_creator] = false;
        emit ContentCreatorRemoved(_creator);
    }

    // Check if an address is an admin
    function isAdmin(address _account) external view returns (bool) {
        return admins[_account];
    }

    // Check if an address is a content creator
    function isContentCreator(address _account)
        external
        view
        returns (bool)
    {
        return contentCreators[_account];
    }
}
