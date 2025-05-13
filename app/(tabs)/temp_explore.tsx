import { Image } from 'expo-image';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, FlatList, Platform, Dimensions, ImageBackground, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, MajorMonoDisplay_400Regular } from '@expo-google-fonts/major-mono-display';


// Obter dimensões da tela para responsividade
const { width, height } = Dimensions.get('window');

// Tipo para os objetos de planeta
interface PlanetItem {
  id: string;
  name: string;
  curiosity: string;
  image: string;
  imageUri?: string; // URI para imagens enviadas pelo usuário
}

// Imagens para os planetas
const getPlanetImage = (imageName: string) => {
  // Usando apenas placeholder para evitar erros com arquivos de imagem
  return require('../../assets/images/adaptive-icon.png');
};

// Lista vazia para começar - usuário adicionará seus próprios planetas
const initialPlanets: PlanetItem[] = [];

export default function PlanetExploreScreen() {
  // Estado para carregar as fontes
  const [fontsLoaded] = useFonts({
    MajorMonoDisplay_400Regular,
  });

  // Estado para a lista de planetas
  const [planets, setPlanets] = useState<PlanetItem[]>([]);
  
  // Estados para modais
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Estados para formulários
  const [currentPlanet, setCurrentPlanet] = useState<PlanetItem | null>(null);
  const [newPlanetName, setNewPlanetName] = useState('');
  const [newPlanetCuriosity, setNewPlanetCuriosity] = useState('');
  const [newPlanetImageUri, setNewPlanetImageUri] = useState<string | null>(null);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    loadPlanets();
  }, []);

  // Função para carregar os planetas do AsyncStorage
  const loadPlanets = async () => {
    try {
      const storedPlanets = await AsyncStorage.getItem('planets');
      
      if (storedPlanets) {
        setPlanets(JSON.parse(storedPlanets));
      } else {
        // Se não houver dados salvos, use os dados iniciais
        await AsyncStorage.setItem('planets', JSON.stringify(initialPlanets));
        setPlanets(initialPlanets);
      }
    } catch (error) {
      console.error('Erro ao carregar planetas:', error);
    }
  };

  // Função para selecionar imagem do dispositivo
  const pickImage = () => {
    // Exibir alerta para informar que a funcionalidade está em desenvolvimento
    Alert.alert(
      "Selecionar Imagem", 
      "A função de upload de imagens está em desenvolvimento. Por enquanto, será usada a imagem padrão.",
      [
        {
          text: "OK",
          onPress: () => console.log("Alerta fechado")
        }
      ]
    );
  };

  // Função para adicionar um novo planeta
  const addPlanet = async () => {
    if (newPlanetName.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira um nome para o planeta.');
      return;
    }
    
    const newPlanet: PlanetItem = {
      id: Date.now().toString(),
      name: newPlanetName,
      curiosity: newPlanetCuriosity || 'Nenhuma curiosidade adicionada.',
      image: 'adaptive-icon',
      // No futuro, aqui será armazenada a URI da imagem selecionada
    };
    
    const updatedPlanets = [...planets, newPlanet];
    try {
      await AsyncStorage.setItem('planets', JSON.stringify(updatedPlanets));
      setPlanets(updatedPlanets);
      setNewPlanetName('');
      setNewPlanetCuriosity('');
      setNewPlanetImageUri(null);
      setAddModalVisible(false);
    } catch (error) {
      console.error('Erro ao adicionar planeta:', error);
      Alert.alert('Erro', 'Não foi possível salvar o planeta.');
    }
  };

  // Função para atualizar um planeta
  const updatePlanet = async () => {
    if (!currentPlanet || newPlanetCuriosity.trim() === '') return;
    
    const updatedPlanets = planets.map(planet => {
      if (planet.id === currentPlanet.id) {
        return {
          ...planet,
          curiosity: newPlanetCuriosity,
        };
      }
      return planet;
    });
    
    try {
      await AsyncStorage.setItem('planets', JSON.stringify(updatedPlanets));
      setPlanets(updatedPlanets);
      setCurrentPlanet(null);
      setNewPlanetCuriosity('');
      setEditModalVisible(false);
    } catch (error) {
      console.error('Erro ao atualizar planeta:', error);
    }
  };

  // Função para excluir um planeta
  const deletePlanet = async (id: string) => {
    const updatedPlanets = planets.filter(planet => planet.id !== id);
    try {
      await AsyncStorage.setItem('planets', JSON.stringify(updatedPlanets));
      setPlanets(updatedPlanets);
    } catch (error) {
      console.error('Erro ao excluir planeta:', error);
    }
  };

  // Função para abrir o modal de edição
  const openEditModal = (planet: PlanetItem) => {
    setCurrentPlanet(planet);
    setNewPlanetCuriosity(planet.curiosity);
    setEditModalVisible(true);
  };
  
  // Renderiza um item de planeta na lista
  const renderPlanetItem = ({ item }: { item: PlanetItem }) => {
    return (
      <View style={styles.planetCard}>
        <View style={styles.planetImageContainer}>
          <Image
            source={item.imageUri ? { uri: item.imageUri } : getPlanetImage(item.image)}
            style={styles.planetImage}
            contentFit="cover"
          />
        </View>
        
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>{item.name}</Text>
          
          <Text style={styles.curiosityLabel}>Curiosidade:</Text>
          <Text style={styles.curiosityText}>{item.curiosity}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => openEditModal(item)}>
              <Image 
                source={require('../../assets/images/image 6.png')} 
                style={styles.buttonIcon} 
                contentFit="contain"
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deletePlanet(item.id)}>
              <Image 
                source={require('../../assets/images/image.png')} 
                style={styles.buttonIcon} 
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Se as fontes ainda estão carregando, mostra uma tela de carregamento
  if (!fontsLoaded) {
    return (
      <View style={styles.background}>
        <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>Carregando fonte...</Text>
      </View>
    );
  }

  // Renderiza a interface principal
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/1_VqSGgUTTUutNfcKbb7ed9w.gif')} 
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header com logo e botão de adicionar */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoTextWhite}>s</Text>
            <Text style={styles.logoTextGray}>pace</Text>
            <Text style={styles.logoTextPurple}>X</Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de planetas */}
        <FlatList
          data={planets}
          renderItem={renderPlanetItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.planetsList}
        />
      </ImageBackground>

      {/* Modal para adicionar novo planeta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Planeta</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.modalLabel}>Nome do Planeta:</Text>
              <TextInput
                style={styles.input}
                value={newPlanetName}
                onChangeText={setNewPlanetName}
                placeholder="Ex: Marte"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.modalLabel}>Curiosidade:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newPlanetCuriosity}
                onChangeText={setNewPlanetCuriosity}
                placeholder="Ex: Marte tem a montanha mais alta do sistema solar"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline={true}
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.modalLabel}>Imagem:</Text>
              <TouchableOpacity 
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <View style={styles.imagePreview}>
                  {newPlanetImageUri ? (
                    <Image
                      source={{ uri: newPlanetImageUri }}
                      style={{ width: '100%', height: '100%', borderRadius: 40 }}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.imagePickerOverlay}>
                      <Text style={styles.imagePickerText}>Selecionar imagem</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setNewPlanetName('');
                  setNewPlanetCuriosity('');
                  setNewPlanetImageUri(null);
                  setAddModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={addPlanet}
              >
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar planeta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {currentPlanet && (
              <>
                <Text style={styles.modalTitle}>Editar {currentPlanet.name}</Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.modalLabel}>Curiosidade:</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={newPlanetCuriosity}
                    onChangeText={setNewPlanetCuriosity}
                    placeholder="Adicione uma curiosidade"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setCurrentPlanet(null);
                      setNewPlanetCuriosity('');
                      setEditModalVisible(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={updatePlanet}
                  >
                    <Text style={styles.buttonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos de fundo e container
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(156, 39, 176, 0.3)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextWhite: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  logoTextGray: {
    color: '#CCCCCC',
    fontWeight: 'bold',
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  logoTextPurple: {
    color: '#9C27B0',
    fontWeight: 'bold',
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  
  // Estilo de botão e lista
  addButton: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  planetsList: {
    padding: 15,
  },
  
  // Cards de planetas
  planetCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    marginVertical: 10,
    padding: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.3)',
  },
  planetImageContainer: {
    width: 110,
    height: '100%',
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: -8,
    marginTop: -2,
  },
  planetImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  planetInfo: {
    flex: 1,
  },
  planetName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  curiosityLabel: {
    color: '#9C27B0',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10,
  },
  curiosityText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 12,
  },
  
  // Botões de ação
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    width: 95,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    
  },
  deleteButton: {
    width: 95,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  
  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#212121',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#9C27B0',
    elevation: 5,
  },
  formGroup: {
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    letterSpacing: 0.5,
  },
  modalLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    borderWidth: 1,
    borderColor: '#444444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  
  // Botões do modal
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#424242',
  },
  confirmButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Seleção de imagem
  imagePickerButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imagePickerOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
  },
});
