import { StyleSheet, View, TouchableOpacity, TextInput, FlatList, Text } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import useColors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { UserContext } from '../../Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { url, usePost } from '../../Utils/usePost';

const Chat = ({ route }) => {
  
  const { user, loadData } = useContext(UserContext);

  const navigation = useNavigation();
  const Colors = useColors();
  const styles = DynamicStyles(Colors);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [chat, setChat] = useState(route.params.chat)

  const socketRef = useRef(null);
  const flatListRef = useRef(null);
  
  const scrollDown = () => {
    flatListRef.current?.scrollToEnd({ animated: true })
  };

  useEffect(() => {
    async function name() {
      const response = await usePost('/chat/getChatById', {
        id: route.params.chat._id,
      })
      if (response.chat !== chat) {
        setChat(response.chat)
      }
    } name()

  }, []);

  useEffect(() => {
    const setupSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      socketRef.current = io(url, {
        query: { token },
      });
  
      const storedMessages = await AsyncStorage.getItem(chat._id);
      const parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];
      
      // Asegurar que chat.notReadedMessages es un array antes de combinar
      const notReadedMessages = chat.notReadedMessages.filter((message) => message.user._id !== user._id) 
  
      setMessages([...parsedMessages, ...notReadedMessages]);

      const response = await usePost('/chat/readMessages', {
        chatId:chat._id,
        userId:user._id,
      })

      console.log(response)
  
      socketRef.current.emit('openChat', chat);
  
      socketRef.current.on('newMessage', (message) => {
        console.log('Received message from server:', message);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          scrollDown();
          return updatedMessages;
        });
      });
    };
  
    setupSocket();
  
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('closeChat');
        socketRef.current.disconnect();
      }
    };
  }, [chat]);

  async function deleteChatStorage () {
    await AsyncStorage.removeItem(chat._id)
    setMessages([])
  }
  

  const sendMessage = async () => {
      if (chat.requestChat) {
        const response = await usePost('/chat/accept', {
          chatId: chat._id,
        })
        if (response.error) {
          Toast.show({
            type:"error",
            text1:response.error,
            visibilityTime: 2000, 
            autoHide: true,
        }); return }
        setChat((prev) => ({ ...prev, requestChat: false }));
      }
      if (messageText.trim()) {
        const messageData = { content: messageText, user: {_id: user._id, name: user.name} };
        console.log('Sending message:', messageData); 
        socketRef.current.emit('sendMessage', messageData);
        setMessageText('');
      }
  };


  useEffect(() => {
    const saveMessages = async () => {
      try {
        if (messages.length > 0) {
          await AsyncStorage.setItem(chat._id, JSON.stringify(messages));
        }
      } catch (error) {
        console.error('Error al guardar mensajes:', error);
      }
    };
  
    saveMessages();
  }, [messages]);
  
  
  
  return (
    <View style={{ backgroundColor: Colors.ligthBackground, flex: 1, padding: 10 }}>
      <View style={{ marginBottom: 15, flexDirection:"row", justifyContent:"space-between" }}>
        <TouchableOpacity onPress={() => {navigation.goBack(), loadData()}}>
          <AntDesign name="arrowleft" size={28} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteChatStorage}>
          <Text>Vaciar Chat</Text>
        </TouchableOpacity>
      </View>

      {chat.requestChat && (
        <View style={{backgroundColor:"#006eff1f", borderRadius:20, paddingVertical:20, marginHorizontal:20}}>
          <Text style={{textAlign:"center", color:Colors.text, fontSize:15}}>Solicitud de mensaje</Text>
        </View>
      )}

      <FlatList
        data={messages}
        ref={flatListRef}
        style={{paddingBottom:100}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const isMine = item.user._id == user._id

          return (
            <View style={{alignItems:!isMine?"flex-start":"flex-end", width:"100%"}}>
              <View style={{ padding: 10, backgroundColor: isMine?Colors.mainBlue:"#00000010", borderRadius:10, minWidth:60, marginVertical: 5, maxWidth:200 }}>
                <Text style={{ color: isMine?Colors.antiText:Colors.text, fontSize:10, textAlign:"left" }}>{isMine?"Yo":item.user.name}</Text>
                <Text style={{ color: isMine?Colors.antiText:Colors.text }}>{item.content}</Text>
              </View>
            </View>

        )}}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <TextInput
          style={{ flex: 1, backgroundColor: Colors.input, padding: 10, borderRadius: 5, color: Colors.text }}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={Colors.placeholder}
        />
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
          <AntDesign name="arrowright" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const DynamicStyles = (Colors) =>
  StyleSheet.create({
    text: {
      color: Colors.text,
      fontFamily: 'Lato-Regular',
    },
  });
