import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { COLOR } from '../../constants/color';

export default function StatusHeader({title}) {
  return (
    <SafeAreaView>
    <View style={styles.statusContainer}>
      <Pressable style={styles.Container} onPress={()=>router.back()}>
      <MaterialIcons name="arrow-back" size={24} color={COLOR.secondary} />
      <Text style={styles.Text}>{title}</Text>
      </Pressable>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({ 
      statusContainer:{
        padding:12 , 
        backgroundColor:"white" ,
        paddingLeft:20,
       
       
      }
      ,
      Container:{
 flexDirection:'row',
 gap:30
      },
      Text:{
        fontWeight:700,
        fontSize:22,
        color:'#00a99d'

      }
})