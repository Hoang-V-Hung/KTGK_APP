import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { layout } from '../theme/colors';
import { useFieldList, FIELD_FILTERS } from '../hooks/useFieldList';
import { Button } from '../components/Button';
import { FieldCard } from '../components/FieldCard';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterChips } from '../components/FilterChips';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'> };

export function FieldListScreen({ navigation }: Props) {
  const {
    fields,
    bookings,
    visibleFields,
    activeCount,
    search,
    setSearch,
    status,
    setStatus,
    saving,
    requestDelete,
  } = useFieldList();

  return (
    <View style={layout.screen}>
      <FlatList
        data={visibleFields}
        keyExtractor={field => field.id}
        contentContainerStyle={layout.content}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.header}>
            <PageHeader
              title="Danh sách sân"
              description={`${activeCount}/${fields.length} sân hoạt động`}
            />
            <Button
              title="+ Thêm sân"
              variant="primary"
              onPress={() => navigation.navigate('FieldForm')}
              disabled={saving}
            />
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm sân theo tên…"
            />
            <FilterChips
              options={FIELD_FILTERS}
              value={status}
              onChange={setStatus}
            />
            <Text style={layout.muted}>
              {visibleFields.length} sân trong danh sách
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={fields.length ? 'Không tìm thấy sân' : 'Chưa có sân nào'}
            message={
              fields.length
                ? 'Thử đổi tên tìm kiếm hoặc chọn bộ lọc khác.'
                : 'Nhấn “+ Thêm sân” để tạo sân đầu tiên.'
            }
          />
        }
        renderItem={({ item: field }) => (
          <FieldCard
            field={field}
            saving={saving}
            bookingCount={
              bookings.filter(booking => booking.fieldId === field.id).length
            }
            onOpen={() =>
              navigation.navigate('FieldDetail', { fieldId: field.id })
            }
            onEdit={() =>
              navigation.navigate('FieldForm', { fieldId: field.id })
            }
            onDelete={() => requestDelete(field)}
          />
        )}
      />
    </View>
  );
}
function Separator() {
  return <View style={layout.separator} />;
}
const styles = StyleSheet.create({ header: { gap: 16, marginBottom: 16 } });

