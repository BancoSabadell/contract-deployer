pragma solidity ^0.4.6;

import "Bar.sol";

contract Foo {
    Bar bar;
    function Foo(string something) {
        bar = new Bar();
    }

    function foo() {
        bar.bar();
    }
}