import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, MajorMonoDisplay_400Regular } from '@expo-google-fonts/major-mono-display';

// Obter as dimensões da tela para responsividade
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375; // iPhone SE ou menor
const isLargeDevice = width >= 414; // iPhone Plus, Pro Max ou maiores

export default function HomeScreen() {
  const router = useRouter();

  // Carregar a fonte Major Mono Display
  const [fontsLoaded] = useFonts({
    MajorMonoDisplay_400Regular,
  });

  const handleStart = () => {
    // Navegar para a próxima tela
    router.push('/(tabs)/explore');
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.background}>
        <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>Carregando fonte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      {/* Pontos de estrelas criados estaticamente */}
      {Array(150).fill(0).map((_, index) => {
        const size = Math.random() * 2 + 0.5;
        return (
          <View 
            key={index} 
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.9 + 0.1
            }} 
          />
        );
      })}
      
      {/* Lua na lateral direita */}
      <Image
        source={require('@/assets/images/unsplash_wKlqqfNTLsI.png')}
        style={styles.moonImage}
        contentFit="contain"
        contentPosition={{right: 0}}
        cachePolicy="memory"
      />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextWhite}>s</Text>
          <Text style={styles.logoTextGray}>pace</Text>
          <Text style={styles.logoTextPurple}>X</Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.jerseyTitle}>Aprenda sobre</Text>
          <Text style={styles.jerseyTitle}>Qualquer planeta</Text>
          <Text style={styles.jerseyTitle}>do sistema solar</Text>
        </View>
        
        <TouchableOpacity style={styles.buttonContainer} onPress={handleStart}>
          <LinearGradient
            colors={['#A633EA', '#7928CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Começar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black', // Fundo preto do espaço
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 15,
  },
  logoTextWhite: {
    fontSize: 48,
    fontFamily: 'MajorMonoDisplay_400Regular',
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  logoTextGray: {
    fontSize: 48,
    fontFamily: 'MajorMonoDisplay_400Regular',
    color: 'white',
    letterSpacing: 1,
  },
  logoTextPurple: {
    fontSize: 48,
    fontFamily: 'MajorMonoDisplay_400Regular',
    color: '#9333EA',
    transform: [{ rotate: '4deg' }], // Rotaciona o X para parecer mais com uma ampulheta
    letterSpacing: 1,
  },
  contentContainer: {
    marginTop: 0,
    marginBottom: 50,
    alignItems: 'flex-start',
    paddingLeft: 30,
    letterSpacing: 0.5,
  },
  jerseyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
    textAlign: 'left',
    lineHeight: 30,
    letterSpacing: 0,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    top: -100,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 178,
    alignSelf: 'flex-start',
    marginLeft: 21,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 9,
    top: -358,
  },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos da lua
  moonImage: {
    position: 'absolute',
    right: -120,
    top: 150,
    width: 450,
    height: 700,
    opacity: 0.8,
    backgroundColor: 'transparent',
    zIndex: -1
  }
});
