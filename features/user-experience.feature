Feature: Navigate between items, categories, and assign items categories

  Scenario: Navigate between todos
    Given I have created todos (more than one)
    When I swipe up and down
    Then I should see the todos in order

  Scenario: Navigate between categories
    Given I have created todos (more than one)
    When I swipe left and right on the background
    Then I should see a different category of todos

  Scenario: Creating a new todo
    Given I just started creating a todo
    And I am not in the 'Todo' or 'Doing' category
    Then I can clearly see that I am in the 'Doing' category

  Scenario: Move item horizontally (across column)
    Given I am viewing a column with items
    When I touch this item and swipe to the right
    Then it should be assigned to the category to the right and not be visible

