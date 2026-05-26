import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface CalendarModalProps {
  visible: boolean;
  selectedDate: Date;
  minimumDate?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  theme: Record<string, string>;
}

const DAYS_OF_WEEK = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date): boolean {
  const ad = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bd = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return ad < bd;
}

export default function CalendarModal({
  visible,
  selectedDate,
  minimumDate,
  onSelect,
  onClose,
  theme,
}: CalendarModalProps) {
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [tempDate, setTempDate] = useState<Date>(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setTempDate(selectedDate);
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [visible]);

  // ─── Helpers ────────────────────────────────────────────────────

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const canGoPrev = (): boolean => {
    if (!minimumDate) return true;
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const lastDayOfPrev = getDaysInMonth(prevYear, prevMonth);
    const test = new Date(prevYear, prevMonth, lastDayOfPrev);
    return !isBeforeDay(test, minimumDate);
  };

  // ─── Navigation ─────────────────────────────────────────────────

  const handlePrevMonth = () => {
    if (!canGoPrev()) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isDayDisabled = (day: number): boolean => {
    if (!minimumDate) return false;
    const date = new Date(viewYear, viewMonth, day);
    return isBeforeDay(date, minimumDate);
  };

  const handleDayPress = (day: number) => {
    if (isDayDisabled(day)) return;
    setTempDate(new Date(viewYear, viewMonth, day));
  };

  const handleSelect = () => {
    onSelect(tempDate);
    onClose();
  };

  const handleClose = () => {
    setTempDate(selectedDate);
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
    onClose();
  };

  // ─── Build calendar grid ────────────────────────────────────────

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          {/* Month / Year header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handlePrevMonth}
              style={[styles.navBtn, !canGoPrev() && { opacity: 0.3 }]}
              disabled={!canGoPrev()}
            >
              <Text style={[styles.navText, { color: theme.tint }]}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.monthTitle, { color: theme.text }]}>
              {MONTHS[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
              <Text style={[styles.navText, { color: theme.tint }]}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day-of-week row */}
          <View style={styles.weekRow}>
            {DAYS_OF_WEEK.map((d) => (
              <View key={d} style={styles.dayCell}>
                <Text style={[styles.dayHeaderText, { color: theme.muted }]}>
                  {d}
                </Text>
              </View>
            ))}
          </View>

          {/* Days grid */}
          {weeks.map((week, wi) => (
            <View key={`w${wi}`} style={styles.weekRow}>
              {week.map((day, di) => {
                if (day === null) {
                  return <View key={`e${wi}-${di}`} style={styles.dayCell} />;
                }

                const disabled = isDayDisabled(day);
                const isSelected =
                  tempDate.getFullYear() === viewYear &&
                  tempDate.getMonth() === viewMonth &&
                  tempDate.getDate() === day;
                const isToday = isSameDay(
                  new Date(viewYear, viewMonth, day),
                  today
                );

                return (
                  <TouchableOpacity
                    key={`d${wi}-${di}`}
                    style={[
                      styles.dayCell,
                      isSelected && {
                        backgroundColor: theme.buttonPrimary,
                        borderRadius: 20,
                      },
                    ]}
                    onPress={() => handleDayPress(day)}
                    disabled={disabled}
                    activeOpacity={0.6}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: disabled
                            ? theme.muted + '60'
                            : isSelected
                            ? theme.headerText
                            : isToday
                            ? theme.tint
                            : theme.text,
                        },
                        isToday && !isSelected && { fontWeight: '800' },
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: theme.border, borderWidth: 1 }]}
              onPress={handleClose}
            >
              <Text style={[styles.actionText, { color: theme.text }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.buttonPrimary }]}
              onPress={handleSelect}
            >
              <Text style={[styles.actionText, { color: theme.headerText }]}>
                Seleccionar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 360,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  navBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
  monthTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dayText: {
    fontSize: FontSizes.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  actionBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
  },
  actionText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
