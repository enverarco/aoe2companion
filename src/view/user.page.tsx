import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchMatches } from '../api/matches';
import Profile from './profile';
import Rating from './rating';
import { useApi } from '../hooks/use-api';
import { loadRatingHistories } from '../service/rating';
import { loadProfile } from '../service/profile';
import { Game } from './components/game';


type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Main'>;
    route: RouteProp<RootStackParamList, 'Main'>;
};

export default function UserPage({navigation}: Props) {
    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();

    console.log("==> USER PAGE");
    console.log("==> USER PAGE");
    console.log("==> USER PAGE");

    const game = 'aoe2de';
    const steam_id = route.params.id.steam_id;
    const profile_id = route.params.id.profile_id;

    const rating = useApi(loadRatingHistories, 'aoe2de', steam_id);
    const profile = useApi(loadProfile, 'aoe2de', profile_id);
    const matches = useApi(fetchMatches, game, profile_id, 0, 10);

    const list = ['profile', 'rating', 'matches-header', ...(matches.data || [])];

    return (
            <View style={styles.container}>
                <View style={styles.content}>

                    <FlatList
                            onRefresh={() => { rating.reload(); profile.reload(); matches.reload(); }}
                            refreshing={rating.loading || profile.loading || matches.loading}
                            style={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'profile':
                                        if (profile.data == null) return <Text>...</Text>;
                                        return <Profile data={profile.data}/>;
                                    case 'matches-header':
                                        return <Text style={styles.matchesHeader}>Matches</Text>;
                                    default:
                                        return <Game data={item as IMatch}/>;
                                }

                            }}
                            keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    matchesHeader: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 14,
        textAlign: 'center',
    },
    list: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});