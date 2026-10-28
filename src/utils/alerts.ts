import { Alert } from 'react-native';

export function showError(error: unknown) {
  Alert.alert(
    'Không thể thực hiện',
    error instanceof Error ? error.message : 'Vui lòng thử lại.',
  );
}
