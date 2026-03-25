import React, { memo, forwardRef } from 'react';
import { TouchableOpacity } from 'react-native';
import styles from './styles/instructor-vertical';

const InstructorVertical = memo(
  forwardRef((props, ref) => {
    const { onPress, productId, style } = props;

    const onNavigateDetail = () => {
      if (typeof onPress === 'function') {
        onPress(productId);
      }
    };

    return (
      <TouchableOpacity
        onPress={onNavigateDetail}
        style={[styles.container, style]}
      />
    );
  }),
  () => true
);
export default InstructorVertical;
