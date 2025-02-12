Feature: Local-First Todo Management

  # Anonymous/Local User Stories
  Scenario: User can create and persist todos locally
    Given I am using the app
    When I create a todo
    And I close and reopen the browser
    Then I should see my todo preserved
    And it should work offline

  Scenario: User can perform CRUD operations offline
    Given I am offline
    When I create, edit, or complete todos
    Then changes should be saved locally
    And operations should work smoothly
    And a sync status should indicate "offline"

  Scenario: User can export todos
    Given I have local todos
    When I export my todos
    Then I should get a file with all my todos
    And I should be able to import it elsewhere

  # Sync and Migration
  Scenario: User can migrate local todos to account
    Given I have local todos
    When I create an account
    Then I should be prompted to migrate my local todos
    And all my existing todos should be preserved

  Scenario: Local changes sync when online
    Given I made changes while offline
    When I regain connection
    Then my changes should sync automatically
    And I should see a sync status indicator