import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

import MapView from "react-native-maps";
import CustomActions from './CustomActions';

// import firebase for -v 9.0.0
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

// const firebase = require('firebase');
// require('firebase/firestore')

export default class Chat extends Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			uid: 0,
			user: {
				_id: '',
				name: '',
				avatar: '',
        image: null,
        location: null,
			},
      isConnected: false
		}
    // Firebase setup
    const firebaseConfig = {
      apiKey: "AIzaSyBhsLQpHoneMkS85gfDttkSUWJNER7qv38",
      authDomain: "chat-app-17ec4.firebaseapp.com",
      projectId: "chat-app-17ec4",
      storageBucket: "chat-app-17ec4.appspot.com",
      messagingSenderId: "226711570958",
      appId: "1:226711570958:web:961350ad14690622eb8a5f",
      measurementId: "G-PWKDJZGJG8"
    };

		// initializes the Firestore app
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}
		//Reference to messages collection
		this.referenceChatMessages = firebase.firestore().collection("messages");

		this.referenceMessagesUser = null;
	}

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

	componentDidMount() {
    let { name } = this.props.route.params;
		this.props.navigation.setOptions({ title: name });

		// Reference to messages collection
		this.referenceChatMessages = firebase.firestore().collection("messages");

    this.getMessages();
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
      }
    });

		// Authenticates user anonymously through Firebase
		this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				firebase.auth().signInAnonymously();
			}
			this.setState({
				uid: user.uid,
				messages: [],
				user: {
					_id: user.uid,
					name: name,
					avatar: "https://placeimg.com/140/140/any",
				},
			});

			this.referenceMessagesUser = firebase
				.firestore()
				.collection("messages")
				.where("uid", '==', this.state.uid);
      this.saveMessages();
			this.unsubscribe = this.referenceChatMessages
				.orderBy("createdAt", "desc")
				.onSnapshot(this.onCollectionUpdate);
		});
	}

	// stop listening to auth and collection
	componentWillUnmount() {
		this.authUnsubscribe();
		this.unsubscribe();
	}

	// Adds messages to cloud storage
	addMessages() {
		const message = this.state.messages[0];
		this.referenceChatMessages.add({
			uid: this.state.uid,
			_id: message._id,
			text: message.text || "",
			createdAt: message.createdAt,
			user: message.user,
      image: message.image || null,
      location: message.location || null,
		});
	}

	onSend(messages = []) {
		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}), () => {
			this.saveMessages();
		});
	}

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

	onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		// go through each document
		querySnapshot.forEach((doc) => {
			// get the QueryDocumentSnapshot's data
			var data = doc.data();
			messages.push({
				_id: data._id,
				text: data.text,
				createdAt: data.createdAt.toDate(),
				user: {
					_id: data.user._id,
					name: data.user.name,
					avatar: data.user.avatar
				},
        image: data.image || null,
        location: data.location || null, 
      });
		});
		this.setState({
			messages: messages,
		});
	};

	// Customize the color of the sender bubble
	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#000'
					}
				}}
			/>
		)
	}

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => {
		return <CustomActions {...props} />;
	};

	// Renders the map location view
	renderCustomView(props) {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{
						width: 150,
						height: 100,
						borderRadius: 13,
						margin: 3
					}}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.latitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	}



	render() {
		let { color, name } = this.props.route.params;
		return (
			<View style={[{ backgroundColor: color }, styles.container]}>
				<GiftedChat
					renderBubble={this.renderBubble.bind(this)}
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
          renderActions={this.renderCustomActions}
					renderCustomView={this.renderCustomView}
					user={{
						_id: this.state.user._id,
						name: name,
						avatar: this.state.user.avatar
					}}
				/>
				{/* Avoid keyboard to overlap text messages on older Andriod versions  */}
				{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text: {
    color: '#ffffff',
  },

});

