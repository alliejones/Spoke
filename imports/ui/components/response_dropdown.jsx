import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Subheader from 'material-ui/Subheader';
import CreateIcon from 'material-ui/svg-icons/content/add'
import {CannedResponseForm} from './canned_response_form'
import Popover from 'material-ui/Popover'
import { insert, update, remove } from '../../api/scripts/methods'
import { List, ListItem } from 'material-ui/List'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'

const styles = {
  popover: {
    width: 500,
    zIndex: 1000
  },
  dialog: {
    zIndex: 10001
  }
}


export class ResponseDropdown extends Component {
  constructor(props) {
    super(props)
    this.handleSelectScript = this.handleSelectScript.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.handleEditScript = this.handleEditScript.bind(this)
    this.submit = this.submit.bind(this)
    this.state = {
      dialogOpen: false,
      popoverOpen: false,
    }
  }

  handleOpenDialog() {
    this.setState({
      dialogOpen: true
    })
  }

  handleCloseDialog() {
    this.setState({
      dialogOpen: false,
      script: null
    })
  }

  handleSelectScript(script) {
    const { onScriptChange, onRequestClose } = this.props
    onScriptChange(script)
    onRequestClose()
  }

  submit() {
    const { campaignId, onScriptChange } = this.props
    const { script } = this.state
    const model = this.refs.form.getModel()

    const callback = (err) => {
      if (err) {
        alert(err)
      } else {
        this.handleCloseDialog()
        onScriptChange(model.text)
      }
    }

    if (script && script._id) {
      update.call(_.extend(model, { scriptId: script._id }), callback)
    } else {
      insert.call(_.extend(model, { campaignId }), callback)
    }

  }

  handleDeleteScript(scriptId) {
    remove.call({ scriptId }, (err) => {
      if (err) {
        alert(err)
      }
    })
  }

  handleEditScript(response) {
    const script = response
    if (!response.userId) {
      delete script['_id']
    }

    this.setState({
      script
    }, this.handleOpenDialog)
  }

  renderScripts(scripts, subheader) {
    return scripts.length === 0 ? '' : [
      <Subheader>{subheader}</Subheader>,
      scripts.map((script) => (
            <ListItem value={script.text}
              key={script._id}
              primaryText={script.title}
              secondaryText={script.text}
              onTouchTap={() => this.handleSelectScript(script.text)}
              rightIconButton={
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                >
                  <MenuItem primaryText="Edit"
                    onTouchTap={() => this.handleEditScript(script)}
                  />
                  {
                    script.userId ? (
                      <MenuItem primaryText="Delete"
                        onTouchTap={() => this.handleDeleteScript(script._id)}
                      />
                    ) : ''
                  }
                </IconMenu>
              }
              secondaryTextLines={2}
            />
          ))
    ]
  }

  render() {
    const { userResponses, campaignResponses, open, onRequestClose, anchorEl } = this.props
    const { dialogOpen } = this.state
    return (
      <div>
        <Popover
          style={styles.popover}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
          onRequestClose={onRequestClose}
        >
          <List>
            {this.renderScripts(campaignResponses, 'Suggested')}
            <Divider />
            {this.renderScripts(userResponses, 'Personal')}
            <Divider />
            <MenuItem
              primaryText="Create new"
              leftIcon={ <CreateIcon />}
              onTouchTap={this.handleOpenDialog}
            />
          </List>
        </Popover>
        <Dialog
          style={styles.dialog}
          open={dialogOpen}
          actions={[
            <FlatButton
              label="Cancel"
              onTouchTap={this.handleCloseDialog}
            />,
            <RaisedButton
              label="Save"
              type="submit"
              disabled={!this.state.doneButtonEnabled}
              onTouchTap={this.submit}
              primary
            />
          ]}
          onRequestClose={this.handleCloseDialog}
        >
          <CannedResponseForm
            ref="form"
            script={this.state.script}
            onValid={() => this.setState( { doneButtonEnabled: true })}
            onInvalid={() => this.setState( { doneButtonEnabled: false })}
          />
        </Dialog>
      </div>
    )
  }
}

ResponseDropdown.propTypes = {
  scripts: React.PropTypes.array,
  onScriptChange: React.PropTypes.function
}