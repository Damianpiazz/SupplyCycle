import { useState, useRef } from 'react';
import { Platform, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import CalendarModal from '@/components/ui/CalendarModal';

interface DatePickerFieldProps {
  /** Fecha actual en formato DD/MM/YYYY */
  value: string;
  /** Callback con la fecha en formato DD/MM/YYYY */
  onChange: (ddmmyyyy: string) => void;
  /** Fecha mínima seleccionable */
  minimumDate?: Date;
  placeholder?: string;
  /** Si true, pinta el borde de error */
  error?: boolean;
  /** Tema de colores activo */
  theme: Record<string, string>;
}

function toDate(ddmmyyyy: string): Date {
  const parts = ddmmyyyy.split('/');
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
    return new Date();
  }
  return new Date(+parts[2], +parts[1] - 1, +parts[0]);
}

function toDDMMYYYY(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function toHTMLDate(ddmmyyyy: string): string {
  const parts = ddmmyyyy.split('/');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DatePickerField({
  value,
  onChange,
  minimumDate,
  placeholder,
  error,
  theme,
}: DatePickerFieldProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ─── Calendar modal ────────────────────────────────────────────

  const openCalendar = () => {
    if (Platform.OS === 'web') {
      inputRef.current?.click();
    } else {
      setShowCalendar(true);
    }
  };

  const handleCalendarSelect = (date: Date) => {
    onChange(toDDMMYYYY(date));
  };

  // ─── Web: native <input type="date"> ───────────────────────────

  const handleWebChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      const [y, m, d] = val.split('-');
      onChange(`${d}/${m}/${y}`);
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.inputBackground,
            borderColor: error ? theme.error : theme.border,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder={placeholder || 'DD/MM/YYYY'}
          placeholderTextColor={theme.muted}
          value={value}
          onChangeText={onChange}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />

        <TouchableOpacity
          style={[styles.calendarBtn, { backgroundColor: theme.buttonPrimary }]}
          onPress={openCalendar}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={22} color={theme.headerText} />
        </TouchableOpacity>
      </View>

      {/* Calendar modal (Android, iOS) */}
      {Platform.OS !== 'web' && (
        <CalendarModal
          visible={showCalendar}
          selectedDate={toDate(value)}
          minimumDate={minimumDate}
          onSelect={handleCalendarSelect}
          onClose={() => setShowCalendar(false)}
          theme={theme}
        />
      )}

      {/* Web: input date oculto */}
      {Platform.OS === 'web' && (
        <input
          ref={inputRef}
          type="date"
          value={value ? toHTMLDate(value) : ''}
          min={minimumDate ? toHTMLDate(toDDMMYYYY(minimumDate)) : todayStr()}
          onChange={handleWebChange}
          style={styles.webInput}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  webInput: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    height: 0,
    width: 0,
  },
});
