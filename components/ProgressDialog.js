/* eslint-disable react/display-name */
import React from "react";
import { StyleSheet, Modal, ActivityIndicator } from "react-native";
import { MATERIAL_COLORS } from "../constants";

const ProgressDialog = React.memo(({ isVisible }) => (
  <Modal animationType={"none"} transparent visible={isVisible}>
    <ActivityIndicator
      color={MATERIAL_COLORS.grey[1]}
      size={"large"}
      style={styles.indicator}
    />
  </Modal>
));

const styles = StyleSheet.create({
  indicator: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flex: 1,
    justifyContent: "center",
  },
});

export default ProgressDialog;
