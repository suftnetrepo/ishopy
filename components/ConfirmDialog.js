import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MATERIAL_COLORS } from '../constants';

const ConfirmDialog = ({ visible, title, description = "Are you sure you want to delete your profile? You will have to register again to checkout your cart", onCancel, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogText}>{description}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={{ ...styles.button, backgroundColor: MATERIAL_COLORS.red[300] }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: MATERIAL_COLORS.cyan[500],
    borderColor: MATERIAL_COLORS.grey[100],
    borderRadius: 30,
    borderWidth: 1,
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 5

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: MATERIAL_COLORS.grey[1],
    fontSize: 16,
  },
  dialogContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 10,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
});

export default ConfirmDialog