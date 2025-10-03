"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

const BACKEND_URL = "http://localhost:3000/buddy-chat";

export default function ChatScreen() {


  const router = useRouter();
  const { buddyId, buddyName, buddyAvatar } = useLocalSearchParams();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [messages, setMessages] = useState<{ id: string; sender: string; text: string; timestamp: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);




  useEffect(() => {
    if (!buddyId || !isLoaded) return;

    const fetchMessages = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${BACKEND_URL}/history/${buddyId}`, { headers: { Authorization: `Bearer ${token}` } });

        if (res.data.success && res.data.messages.length > 0) {
          const formattedMessages = res.data.messages.map((msg: { id: number; sender: string; message: string; created_at: string }) => ({
            id: msg.id.toString(),
            sender: msg.sender,
            text: msg.message,
            timestamp: formatTime(new Date(msg.created_at)),
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([
            {
              id: "0",
              sender: "buddy",
              text: `Hey I'm ${buddyName}! 👋 What’s up?`,
              timestamp: formatTime(new Date()),
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [buddyId, isLoaded]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const scrollToEnd = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userId = user?.id;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    scrollToEnd();
    setIsTyping(true);

    try {
      const token = await getToken();

      const historyMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const systemMessage = {
        role: "system",
        content: `You are ${buddyName}, the user's buddy.`,
      };

      const res = await axios.post(
        BACKEND_URL,
        {
          message: input,
          history: [systemMessage, ...historyMessages],
          buddyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const buddyReplies = res.data.replies;

      for (const reply of buddyReplies) {
        setMessages((prev) => [...prev, { id: "typing", sender: "buddy", text: "", timestamp: "" }]);
        scrollToEnd();
        await new Promise((res) => setTimeout(res, Math.min(reply.length * 20, 2000)));
        setMessages((prev) => prev.filter((m) => m.id !== "typing"));
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString() + Math.random(), sender: "buddy", text: reply, timestamp: formatTime(new Date()) },
        ]);
        scrollToEnd();
      }

      setUserMessageCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          axios.post(
            "http://192.168.1.118:3000/summarize-memory",
            { buddyId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return 0;
        }
        return newCount;
      });
    } catch (err) {
      console.error("Sending message failed", err);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === "user";
    const isTypingIndicator = item.id === "typing";

    if (isTypingIndicator) {
      return (
        <View style={[styles.messageContainer, styles.buddyMessageContainer]}>
          <View style={[styles.messageBubble, styles.buddyMessageBubble]}>
            <LottieView
              source={require("@/assets/lottie/typing.json")}
              autoPlay
              loop
              style={{ width: 50, height: 30 }}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.buddyMessageContainer]}>
        <View style={[styles.messageBubble, isUser ? styles.userMessageBubble : styles.buddyMessageBubble]}>
          <Text style={isUser ? styles.userMessageText : styles.buddyMessageText}>{item.text}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
              </TouchableOpacity>
              <View style={styles.headerInfo}>
                {buddyAvatar && (
                  <Image source={{ uri: buddyAvatar as string }} style={styles.headerAvatar} />
                )}
                <Text style={styles.headerName}>{buddyName}</Text>
              </View>
              {/* Microphone Button at top right */}
     
        <TouchableOpacity  style={{right:10}}>
          <Image
            source={{ uri: 'https://novabuddy.s3.eu-north-1.amazonaws.com/phone-call.png' }} // 👈 replace with your mic image later
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesList}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TextInput
                placeholder="Message"
                value={input}
                onChangeText={setInput}
                placeholderTextColor="#8E8E93"
                style={styles.textInput}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              {input.trim() ? (
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                  <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.micButton}>
                  <Ionicons name="mic" size={24} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  innerContainer: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", padding: 10 },
  headerInfo: { flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 10 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  messagesList: { padding: 16 },
  messageContainer: { marginVertical: 4, flexDirection: "row" },
  userMessageContainer: { justifyContent: "flex-end" },
  buddyMessageContainer: { justifyContent: "flex-start" },
  messageBubble: { borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10, maxWidth: "75%" },
  userMessageBubble: { backgroundColor: "#000" },
  buddyMessageBubble: { backgroundColor: "#E9E9EB" },
  userMessageText: { fontSize: 16, color: "#FFF" },
  buddyMessageText: { fontSize: 16, color: "#000" },
  timestamp: { fontSize: 11, color: "#8E8E93", marginTop: 2, alignSelf: "flex-end" },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#E5E5EA", backgroundColor: "#FFF" },
  attachButton: { marginRight: 10 },
  textInput: { flex: 1, backgroundColor: "#E9E9EB", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  sendButton: { marginLeft: 10, backgroundColor: "#007AFF", borderRadius: 20, width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  micButton: { marginLeft: 10 },
});
