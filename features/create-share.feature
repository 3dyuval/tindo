Feature: Create and edit the todos from anywhere

  Scenario: Anonymous user can create a todo
    Given I am an anonymous user
    When I create a todo
    And when I close and reopen the browser
    Then I should see the todo

  Scenario: Anonymous user can share a todo link
    Given I am an anonymous user
    When when I share a todo link
    Then I should see the todo on another device and can edit it

  Scenario: Registered user can share a todo link but requires login
    Given I am an registered user
    When when I share a todo link
    And when I open the link on another device
    Then The link should require me to login
