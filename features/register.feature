Feature: Registration to the app as a user

  Scenario: Anonymous user registers
  Given I am anonmymous
  And I have already created todo(s)
  When I register as a user
  And when I login from another device
  Then I should see all my todos

  Scenario: Anonymous user login
    Given I am anonmymous
    And I have already created todo(s)
    When I login
    Then I should see all my previous todos and my already created todo(s)