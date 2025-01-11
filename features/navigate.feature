Feature: Navigate between todos, categories, and assign todos categories

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

  Scenario: Assign a todo to a category before creating it
    Given I have just started to create a todo
    And I am not in the 'Todo' category
    And when I click on the 'Doing' category
    Then I should be able to select a different category, i.e 'Todo'

  Scenario: Move a todo to a 'Done' category
    Given I have created todo(s)
    When I hold and swipe to the right
    Then the todo should be assigned to the category called 'Done'

