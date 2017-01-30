pragma solidity ^0.4.8;

import "Bar.sol";

contract Foo {
    Bar bar;
    function Foo() {
        bar = new Bar();
    }

    function foo() {
        bar.bar();
    }
}