import React, { Component } from 'react';
import { Segment, TextArea, Form, Header, Breadcrumb, Icon, Image, Container } from 'semantic-ui-react';
import { isEmpty, isEqual, find } from 'lodash';
import LoginModal from './loginmodal';
import MessagesList from './messageslist';
import paragraph from '../assets/paragraph.png';

import { bindActionCreators } from 'redux';
import { setCurrentChannel, getChannelMessages } from '../redux/actions';
import { connect } from 'react-redux';

import '../styles/messages.css';

const getChannelFromURL = (props) => {
  return props.location.pathname.split("/")[2];
}

class Messages extends Component {
  componentWillUpdate(nextProps) {
    //console.log(`going from ${getChannelFromURL(this.props)} to ${getChannelFromURL(nextProps)}`)
    if (getChannelFromURL(this.props) !== getChannelFromURL(nextProps)) {
      this.props.setCurrentChannel(getChannelFromURL(nextProps))
      this.props.getChannelMessages()
    }
  }

  render() {
    const { currentUser, currentChannel } = this.props;
    return (
      <div id='messages-container'>
        <Header as='h1' className='channel-name'>
          {currentChannel.private ? (
            <Icon name='lock' size='tiny' />
          ) : (
              <Icon name='world' size='tiny' />
            )}
          <Header.Content>
            <Breadcrumb size='big'>
              <Breadcrumb.Section>messages</Breadcrumb.Section>
              <Breadcrumb.Divider />
              {(!isEmpty(currentChannel)) && currentChannel.name.includes(':') ? (
                <span>
                  <Breadcrumb.Section>dm</Breadcrumb.Section>
                  <Breadcrumb.Divider />
                  <Breadcrumb.Section>{find(currentChannel.name.split(':'), n => n !== currentUser.userName || currentUser.userName)}</Breadcrumb.Section>
                </span>
              ) : (
                  <Breadcrumb.Section>{currentChannel.name}</Breadcrumb.Section>
                )}
            </Breadcrumb>
          </Header.Content>
        </Header>
        <div id='column-messages-container'>
          <div className='text-input-container'>
            <Form>
              {
                (isEmpty(currentUser)) ? (
                  <LoginModal />
                ) : (
                    <TextArea placeholder='chat' autoHeight />
                  )
              }
            </Form>
          </div>
          <Container fluid className='messages-list-container'>
            {(isEmpty(currentUser)) ? (
              <div>
                <Image src={paragraph} />
                <br />
                <Image src={paragraph} />
              </div>
            ) : (
                <MessagesList />
              )}
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    currentChannel: state.currentChannel,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getChannelMessages,
    setCurrentChannel,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
