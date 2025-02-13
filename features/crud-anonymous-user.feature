Feature: Audio Todo Creation and AI Enhancementtoken

  Background:
    Given I am using the app
    And I am on the main board

  Scenario: Record audio todo
    When I click the audio icon
    Then I should see a recording interface
    And I should see a recording timer
    And I should see a cancel button

  Scenario: Complete audio recording
    Given I have finished recording
    Then I should see a loading indicator while processing
    And I should see the waveform visualization
    And I should see basic playback controls

  Scenario: AI Enhancement
    Given I have recorded an audio todo
    When the AI processing completes
    Then I should see:
      | Generated title based on content     |
      | Suggested category (Todo/Doing/Done) |
      | 2-3 relevant tags                    |
    And I should be able to edit these suggestions

  Scenario: Audio todo management
    Given I have an audio todo
    Then I should be able to:
      | Play/pause the audio     |
      | See the duration        |
      | Edit the title          |
      | Change the category     |
      | Modify tags            |

  Scenario: Failed transcription
    Given I record an audio todo
    When the AI processing fails
    Then I should see a generic title "Audio Note <timestamp>"
    And I should be able to add title manually
    And I should be able to try processing again

  Scenario: Offline recording
    Given I am offline
    When I record an audio todo
    Then it should save locally
    And queue for AI processing when online
    And show "Pending Enhancement" status