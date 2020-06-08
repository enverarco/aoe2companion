import 'react-native-gesture-handler';
import { Link, NavigationContainer, useLinkTo } from '@react-navigation/native';
import React from 'react';
import MainPage from './src/view/main.page';
import { Button, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, YellowBox } from 'react-native';
import SearchPage from './src/view/search.page';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Header from './src/view/header';
import Constants from 'expo-constants';
import { parseUserId, printUserId, UserId } from './src/helper/user';
import { FontAwesome } from '@expo/vector-icons';
import UserPage from './src/view/user.page';

YellowBox.ignoreWarnings(['Remote debugger']);

export type RootStackParamList = {
    Main: undefined;
    User: { id: UserId, name: string };
    Search: { name: string };
};

const linking = {
    prefixes: ['https://aoe2companion.com', 'aoe2companion://'],
    config: {
        User: {
            path: 'user/:id/:name',
            parse: {
                id: parseUserId,
                name: String,
            },
            stringify: {
                id: printUserId,
            },
        },
        Search: {
            path: 'search',
        },
        Main: {
            path: 'main',
        },
    },
};

const Stack = createStackNavigator<RootStackParamList>();

const headerStatusBarHeight = 60;

export function Menu() {
    const linkTo = useLinkTo();

    return (
            <View style={styles.menu}>
                <TouchableOpacity onPress={() => linkTo('/search')}>
                    <FontAwesome style={styles.menuButton} name="search" size={18} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => linkTo('/main')}>
                    <FontAwesome style={styles.menuButton} name="user" size={18} />
                </TouchableOpacity>
            </View>
    );
}

export default function App() {
    return (
            <PaperProvider>
                <NavigationContainer linking={linking}>
                    <Stack.Navigator screenOptions={{animationEnabled: false}}>
                        <Stack.Screen
                                name="Main"
                                component={MainPage}
                                options={{
                                    title: 'Me',
                                    headerStatusBarHeight: headerStatusBarHeight,
                                    headerBackground: () => (
                                            <HeaderBackground><Header/></HeaderBackground>
                                    ),
                                    headerRight: () => (
                                            <Menu />
                                    ),
                                }}
                        />
                        <Stack.Screen
                                name="User"
                                component={UserPage}
                                options={({route}) => ({
                                    title: route.params.name,
                                    headerStatusBarHeight: headerStatusBarHeight,
                                    headerBackground: () => (
                                            <HeaderBackground><Header/></HeaderBackground>
                                    ),
                                })}
                        />
                        <Stack.Screen
                                name="Search"
                                component={SearchPage}
                                options={{
                                    title: 'Search',
                                    headerStatusBarHeight: headerStatusBarHeight,
                                    headerBackground: () => (
                                            <HeaderBackground><Header/></HeaderBackground>
                                    ),
                                }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: Constants.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    menu: {
        flexDirection: 'row',
    },
    menuButton: {
        marginRight: 20,
    }
});
