import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from './ExploreScreen';
import SelfDefenseTutorials from './SelfDefenseTutorials';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Explore">
                <Stack.Screen name="Explore" component={ExploreScreen} />
                <Stack.Screen name="SelfDefenseTutorials" component={SelfDefenseTutorials} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App; 