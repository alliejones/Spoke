import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { CampaignQuestionForm } from './campaign_question_form'
import { CampaignFormSectionHeading } from './campaign_form_section_heading'

const styles = {
  questionButton: {
    marginTop: 24
  }
}
export class CampaignSurveyForm extends Component {
  render() {
    const { questions, onValid, onInvalid, onAddSurveyAnswer, onDeleteQuestion, onEditQuestion, onAddQuestion, customFields, sampleContact, campaign} = this.props

    const campaignStarted = campaign && campaign.hasMessage()

    let subtitle
    if (campaignStarted) {
      subtitle = "Once messages have been sent to contacts in this campaign, you can't edit the questions or answers, but you can still edit scripts if you need."
    }
    else {
      subtitle = 'You can add questions and your texters can indicate responses from your contacts. For example, you might want to collect RSVPs to an event or find out whether to follow up about a different volunteer activity.'
    }

    return (
      <Formsy.Form
        onValid={onValid}
        onInvalid={onInvalid}
      >
        <CampaignFormSectionHeading
          title='What do you want to learn?'
          subtitle={subtitle}
        />

        { questions.map ((question) => (
          <CampaignQuestionForm
            question={question}
            questions={questions}
            onAddSurveyAnswer={onAddSurveyAnswer}
            onEditQuestion={onEditQuestion}
            onDeleteQuestion={onDeleteQuestion}
            customFields={customFields}
            sampleContact={sampleContact}
            campaignStarted={campaignStarted}
          />
        ))}
        {
          questions.length === 0 ? (
            <RaisedButton
              style={styles.questionButton}
              label="Add question"
              onTouchTap={onAddQuestion}
            />
          ) : ''
        }
      </Formsy.Form>
    )
  }
}
