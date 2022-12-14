import React, {useState, useEffect} from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Pressable, ImageBackground, StyleSheet } from 'react-native';
import  BackgroundImage from '../assets/BackgroundImage.png';

// Background Colors
const colors = {
	black: "#090C08",
	purple: "#474056",
	grey: "#8A95A5",
	green: "#B9C6AE",
};

export default function Start(props) {
	let [name, setName] = useState();
	let [color, setColor] = useState();

	return (
		<View style={styles.container}>
			<ImageBackground
				source={BackgroundImage}
				resizeMode='cover'
				style={styles.image}
			>

				<Text style={styles.title}>Chat App</Text>

				<View style={styles.box}>

					{/* Input name */}
					<TextInput
						onChangeText={(name) => setName(name)}
						value={name}
						style={styles.input}
						placeholder='Who are you?'
					/>

					{/* Choose background color here */}
					<Text style={styles.text}>Choose Background Color:</Text>
					<View style={styles.colorContainer}>
						<TouchableOpacity
							style={[{ backgroundColor: colors.black }, styles.colorbutton]}
							onPress={() => setColor(colors.black)}
							accessibilityLabel="Option for black chat background"
							accessibilityHint="Chat background coloring options"
							accessibilityRole="button"
						/>
						<TouchableOpacity
							style={[{ backgroundColor: colors.purple }, styles.colorbutton]}
							onPress={() => setColor(colors.purple)}
							accessibilityLabel="Option for Purple chat background"
							accessibilityHint="Chat background coloring options"
							accessibilityRole="button"
						/>
						<TouchableOpacity
							style={[{ backgroundColor: colors.grey }, styles.colorbutton]}
							onPress={() => setColor(colors.grey)}
							accessibilityLabel="Option for grey chat background"
							accessibilityHint="Chat background coloring options"
							accessibilityRole="button"
						/>
						<TouchableOpacity
							style={[{ backgroundColor: colors.green }, styles.colorbutton]}
							onPress={() => setColor(colors.green)}
							accessibilityLabel="Option for green chat background"
							accessibilityHint="Chat background coloring options"
							accessibilityRole="button"
						/>
					</View>

					<Pressable
						onPress={() => props.navigation.navigate('Chat', { name: name, color: color })}
						style={({ pressed }) => [
							{
								backgroundColor: pressed
									? '#585563'
									: '#757083'
							},
							styles.button
						]}
					>
						<Text style={styles.buttontext}>Start Chatting</Text>
					</Pressable>
				</View>
			</ImageBackground>
			{/* Aviods android keyboards from overlapping */}
			{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	image: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},

	title: {
		fontSize: 45,
		fontWeight: '600',
		color: '#ffffff',
	},

	box: {
		width: '88%',
		backgroundColor: 'white',
		alignItems: 'center',
		height: '44%',
		justifyContent: 'space-evenly',

	},

	input: {
		height: 50,
		width: '88%',
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		borderColor: 'gray',
		borderWidth: 1,
		paddingHorizontal: 10,

	},

	text: {
		color: '#757083',
		fontSize: 16,
		fontWeight: '300',
	},

	colorContainer: {
		width: '88%',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},

	colorbutton: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},

	button: {
		height: 50,
		width: '88%',
		justifyContent: 'center',
		alignItems: 'center',
	},

	buttontext: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	}
});
