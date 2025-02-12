Feature: Subscribed User Todo Sync

  # Authentication & Account
  Scenario: User can secure their todos
    Given I am logged in
    When I create or modify todos
    Then they should be encrypted before sync
    And they should sync to my account

  Scenario: Multi-device sync
    Given I am logged in on multiple devices
    When I make changes on one device
    Then changes should sync to other devices
    And I should see real-time updates
    And conflicts should be resolved automatically

  Scenario: Offline capabilities with sync
    Given I am logged in but go offline
    When I make changes offline
    Then changes should queue for sync
    And sync automatically when online
    And show sync status (pending/complete)

  Scenario: Conflict Resolution
    Given I have made changes on multiple devices while offline
    When devices come back online
    Then conflicts should be resolved automatically
    And I should be notified of any manual merge needed
    And I should see the sync history

  Scenario: Selective Sync
    Given I am logged in
    When I mark certain todos as "private"
    Then they should remain local only
    And not sync to the cloud

  Scenario: Version History
    Given I am a subscribed user
    When I make changes to todos
    Then changes should be versioned
    And I should be able to view history
    And restore previous versions