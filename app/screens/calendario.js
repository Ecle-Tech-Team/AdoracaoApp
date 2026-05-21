import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchEventosDoGrupo, fetchEnsaiosDoGrupo } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Feather from '@expo/vector-icons/Feather';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const parseDate = (str) => {
  if (!str) return null;
  try { return new Date(str); } catch { return null; }
};

export default function Calendario({ navigateTo }) {
  const { id_grupo, user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [ensaios, setEnsaios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [evts, ens] = await Promise.all([
          fetchEventosDoGrupo(id_grupo),
          fetchEnsaiosDoGrupo(id_grupo),
        ]);
        setEventos(evts || []);
        setEnsaios(ens || []);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id_grupo]);

  // Build lookup: "YYYY-MM-DD" → { evento: true, ensaio: true }
  const dateMap = {};
  eventos.forEach(e => {
    const d = parseDate(e.data);
    if (d) {
      const key = format(d, 'yyyy-MM-dd');
      if (!dateMap[key]) dateMap[key] = { evento: false, ensaio: false };
      dateMap[key].evento = true;
    }
  });
  ensaios.forEach(e => {
    const d = parseDate(e.data);
    if (d) {
      const key = format(d, 'yyyy-MM-dd');
      if (!dateMap[key]) dateMap[key] = { evento: false, ensaio: false };
      dateMap[key].ensaio = true;
    }
  });

  // Filter activities for selected date
  const selectedKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedAtividades = [
    ...eventos.filter(e => {
      const d = parseDate(e.data);
      return d && format(d, 'yyyy-MM-dd') === selectedKey;
    }).map(e => ({ ...e, tipo: 'evento' })),
    ...ensaios.filter(e => {
      const d = parseDate(e.data);
      return d && format(d, 'yyyy-MM-dd') === selectedKey;
    }).map(e => ({ ...e, tipo: 'ensaio' })),
  ].sort((a, b) => new Date(a.data) - new Date(b.data));

  // Generate calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const daysInGrid = eachDayOfInterval({ start: calStart, end: calEnd });

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayPress = (day) => {
    setSelectedDate(day);
  };

  const backScreen = user?.userType === 'Componente' ? 'GrupoComp' : 'GrupoReg';

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo(backScreen)}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>
        <Text style={{ paddingLeft: 15, ...styles.h2 }}>Calendario</Text>
      </View>

      {/* Month header */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.monthNavBtn}>
          <Feather name="chevron-left" size={22} color="#FFCB69" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.monthNavBtn}>
          <Feather name="chevron-right" size={22} color="#FFCB69" />
        </TouchableOpacity>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, idx) => (
          <View key={idx} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.daysGrid}>
        {daysInGrid.map((day, idx) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dots = dateMap[dayKey];
          const isSelected = isSameDay(day, selectedDate);
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
              ]}
              onPress={() => handleDayPress(day)}
              activeOpacity={0.6}
            >
              <Text style={[
                styles.dayText,
                !inMonth && styles.dayTextOutside,
                isSelected && styles.dayTextSelected,
              ]}>
                {format(day, 'd')}
              </Text>
              {dots && (
                <View style={styles.dotsRow}>
                  {dots.evento && <View style={[styles.dot, styles.dotEvento]} />}
                  {dots.ensaio && <View style={[styles.dot, styles.dotEnsaio]} />}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Cards for selected date */}
      <Text style={styles.selectedDateLabel}>
        {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
      </Text>

      {loading ? (
        <ActivityIndicator size="small" color="#FFCB69" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={selectedAtividades}
          keyExtractor={(item) => `${item.tipo}-${item.id}`}
          renderItem={({ item }) => {
            const isEvento = item.tipo === 'evento';
            const formattedDate = format(new Date(item.data), 'HH:mm', { locale: ptBR });
            return (
              <View style={styles.lista}>
                <View style={[
                  styles.atividadeCard,
                  { backgroundColor: isEvento ? '#FFE2E2' : '#F5FBFF' }
                ]}>
                  <View style={styles.atividadeHeader}>
                    <View style={[
                      styles.tipoBadge,
                      { backgroundColor: isEvento ? '#FF4242' : '#26516E' }
                    ]}>
                      <Text style={styles.tipoBadgeText}>
                        {isEvento ? 'EVENTO' : 'ENSAIO'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.atividadeHora,
                      { color: isEvento ? '#FF4242' : '#26516E' }
                    ]}>
                      {formattedDate}
                    </Text>
                  </View>
                  <Text style={[
                    styles.atividadeDesc,
                    { color: isEvento ? '#FF4242' : '#26516E' }
                  ]}>
                    {item.descricao}
                  </Text>
                  {item.local ? (
                    <Text style={[
                      styles.atividadeLocal,
                      { color: isEvento ? '#FF8282' : '#5F8BA9' }
                    ]}>
                      {item.local}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma atividade nesta data.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    flex: 1,
  },
  titleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#FFCB69',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  monthNavBtn: {
    padding: 6,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginHorizontal: 20,
    textTransform: 'capitalize',
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekdayText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#999',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  dayCell: {
    width: '14.28%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  dayCellSelected: {
    backgroundColor: '#FFF3D6',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
    color: '#333',
    marginBottom: 2,
  },
  dayTextOutside: {
    color: '#ccc',
  },
  dayTextSelected: {
    fontFamily: 'Poppins_700Bold',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotEvento: {
    backgroundColor: '#FF4242',
  },
  dotEnsaio: {
    backgroundColor: '#26516E',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
    marginVertical: 4,
  },
  selectedDateLabel: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#555',
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  lista: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  atividadeCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  atividadeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  tipoBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
  },
  atividadeHora: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  atividadeDesc: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  atividadeLocal: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    color: '#999',
    marginTop: 20,
    fontSize: 14,
  },
});
