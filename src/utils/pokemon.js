import axios from 'axios';
import { asyncMap } from '/src/utils/arrays.js';

export async function getPokemon(pokemonName) {
    try {
        const { data: pokemonData } = await axios({
            method: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
        });
    
        return {
            ...pokemonData,
            abilities: pokemonData.abilities.map(({ ability }) => ability),
            moves: pokemonData.moves.map(({ move }) => move),
            types: pokemonData.types.map(({ type }) => type),
            stats: pokemonData.stats.map((stat) => ({ ...stat, ...stat.stat })),
        };
    } catch (error) {
        console.error(error);
    }
}

export async function getPokemons(page = 1) {
    try {
        const { data: pokemonData } = await axios({
            method: 'GET',
            url: 'https://pokeapi.co/api/v2/pokemon',
            params: {
                limit: 20,
                offset: (page - 1) * 20,
            },
        });

        const { count, next, previous, results } = pokemonData;
        const meta = { count, next, previous };

        const data = [ 
            ...(await asyncMap(results, (pokemon) => {
                return getPokemon(pokemon.name);
            })),
        ];

        return {
            data,
            meta,
        };
    } catch (error) {
        console.error(error);
    }
}

export function getPokemonTypeBg(type) {
    let classes = 'bg-gradient-to-tr ';

    switch (type?.name) {
        case 'bug':
            classes += 'from-green-400 to-green-300';
            break;
        case 'dark':
            classes += 'from-gray-800 to-gray-700';
            break;
        case 'dragon':
            classes += 'from-cyan-400 to-cyan-300';
            break;
        case 'electric':
            classes += 'from-yellow-400 to-yellow-300';
            break;
        case 'fairy':
            classes += 'from-pink-500 to-pink-400';
            break;
        case 'fighting':
            classes += 'from-orange-400 to-orange-300';
            break;
        case 'fire':
            classes += 'from-rose-500 to-rose-400';
            break;
        case 'fliying':
            classes += 'from-sky-700 to-sky-600';
            break;
        case 'ghost':
            classes += 'from-indigo-700 to-indigo-600';
            break;
        case 'grass':
            classes += 'from-emerald-500 to-emerald-400';
            break;
        case 'ground':
            classes += 'from-amber-700 to-amber-600';
            break;
        case 'ice':
            classes += 'from-teal-300 to-teal-200';
            break;
        case 'normal':
            classes += 'from-pink-300 to-pink-200';
            break;
        case 'poison':
            classes += 'from-purple-500 to-purple-400';
            break;
        case 'psychic':
            classes += 'from-fuchsia-600 to-fuchsia-500';
            break;
        case 'rock':
            classes += 'from-yellow-800 to-yellow-700';
            break;
        case 'steel':
            classes += 'from-teal-500 to-teal-400';
            break;
        case 'water':
            classes += 'from-blue-500 to-blue-400';
            break;
        default:
            classes += 'from-gray-500 to-gray-400';
            break;
    };

    return classes;
}