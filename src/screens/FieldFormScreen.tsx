import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFieldForm } from '../hooks/useFieldForm';
import { RootStackParamList } from '../types';
import { layout } from '../theme/colors';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { ChoiceGroup } from '../components/ChoiceGroup';
import { EmptyState } from '../components/EmptyState';
import { FIELD_STATUSES, FIELD_TYPES } from '../constants/rules';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldForm'>;
export function FieldFormScreen({ navigation, route }: Props) {
  const id = route.params?.fieldId;
  const insets = useSafeAreaInsets();
  const { field, input, saving, change, blur, errorFor, submit } = useFieldForm(
    id,
    () => navigation.goBack(),
  );
  if (id && !field) {
    return (
      <SafeAreaView style={layout.screen}>
        <EmptyState
          title="Sân không còn tồn tại"
          message="Vui lòng quay lại danh sách sân."
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={layout.screen}>
      <KeyboardAvoidingView
        style={layout.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 56}
      >
        <ScrollView
          contentContainerStyle={layout.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.intro}>
            <Text style={layout.title}>
              {id ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
            </Text>
            <Text style={layout.muted}>
              Thông tin sân và giá thuê theo giờ. Các mục có * là bắt buộc.
            </Text>
          </View>
          <View style={layout.card}>
            <FormField
              label="Tên sân"
              value={input.name}
              onChangeText={value => change('name', value)}
              editable={!saving}
              placeholder="Ví dụ: Sân A3"
              onBlur={() => blur('name')}
              error={errorFor('name')}
            />
            <ChoiceGroup
              label="Loại sân"
              options={FIELD_TYPES}
              value={input.type}
              onChange={value => change('type', value)}
              disabled={saving}
            />
            <FormField
              label="Giá thuê mỗi giờ (VNĐ)"
              value={input.pricePerHour}
              onChangeText={value => change('pricePerHour', value)}
              placeholder="Ví dụ: 300000"
              keyboardType="numeric"
              editable={!saving}
              onBlur={() => blur('pricePerHour')}
              error={errorFor('pricePerHour')}
            />
            <ChoiceGroup
              label="Trạng thái"
              options={FIELD_STATUSES}
              value={input.status}
              onChange={value => change('status', value)}
              disabled={saving}
            />
          </View>
          <Button
            title={saving ? 'Đang lưu…' : id ? 'Lưu thay đổi' : 'Thêm sân'}
            variant="primary"
            onPress={() => {
              submit();
            }}
            disabled={saving}
          />
          <Button
            title="Huỷ"
            onPress={() => navigation.goBack()}
            disabled={saving}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ intro: { gap: 8 } });
