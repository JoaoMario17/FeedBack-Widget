import { ArrowLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import { 
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { theme } from '../../theme';

import { api } from '../../libs/api';
import * as FileSystem from 'expo-file-system'

import { captureScreen } from 'react-native-view-shot'

import { styles } from './style';

import { FeedbackType } from '../Widget'
import { ScreenShot } from '../ScreenShot'
import { Button } from '../Button'

import { feedbackTypes } from '../../utils/feedbackTypes'

interface Props {
  feedbackType: FeedbackType;
  onFeedbackReset: () => void;
  onFeedbackSent: () => void;
}

export function Form({ feedbackType, onFeedbackReset, onFeedbackSent}: Props) {

  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenShot] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenShot() {
    captureScreen({
      format: 'png',
      quality: 0.8
    })
      .then(uri => setScreenShot(uri))
      .catch(err => console.log(err));
  }

  function handleScreenshotRemove() {
    setScreenShot(null);
  }

  async function sendFeedback() {
    if (isSendingFeedback) return
    
    setIsSendingFeedback(true);
    const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64'});

    try{
      await api.post('/feedbacks',{
        type: feedbackType,
        comment,
        screenshot: `data:image/png;base64, ${screenshotBase64}`
      });

      onFeedbackSent();  

    } catch (err) {
      console.log(err);
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onFeedbackReset}
        >
          <ArrowLeft
            size={24}
            weight='bold'
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image
            source={feedbackTypeInfo.image}
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder='Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo...'
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenShot
          onTakeShot={handleScreenShot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />
        <Button 
          onPress={sendFeedback}
          isLoading={isSendingFeedback} 
        />
      </View>
    </View>
  );
}