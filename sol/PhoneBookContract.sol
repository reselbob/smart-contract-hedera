// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract PhoneBookContract {
    // declare the mapping variable that will store the phonebook information
    mapping(string => uint) public myDirectory;

    // This is the setter function that adds an entry to the phonebook represents
    // by the mapping variable
    function setMobileNumber(string memory _name, uint _mobileNumber) public {
        myDirectory[_name] = _mobileNumber;
    }

    // This is the getter function that retrieves an entry from the phonebook according to
    // _name parameter passed to the function.
    function getMobileNumber(string memory _name) public view returns (uint) {
        return myDirectory[_name];
    }

}
