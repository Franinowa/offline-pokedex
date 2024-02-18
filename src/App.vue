<template>
	<div 
		ref="pokemonsList"
		class="h-screen overflow-y-auto"
	>
		<!-- <div 
			v-if="!isOnline"
			class="fixed top-0 inset-x-0 py-2 bg-rose-100/25 z-50"
		>
			<p class="text-sm text-center text-rose-500">
				Sorry, you are offline
			</p>
		</div> -->

		<div class="sticky top-0 pt-safe bg-white/75 backdrop-blur-md z-20">
			<div class="px-6 py-4 flex items-center gap-x-2">
				<div class="flex-1 min-w-0">
					<div class="flex items-baseline gap-x-2">
						<h1 class="text-2xl font-bold text-gray-800">
							Pokédex
						</h1>

						<!-- <p class="text-gray-500">
							({{ pokemons.length }})
						</p> -->
					</div>

					<div>
						<p class="text-sm text-gray-400">
							Showing 
							<strong class="text-gray-500 font-bold">{{ pokemonsMeta?.page * 20 }}</strong> 
							pokemons of 
							<strong class="text-gray-500 font-bold">{{ pokemonsCount }}</strong> 
						</p>
					</div>
				</div>

				<div class="flex items-center gap-x-4">
					<SignalIcon v-if="isOnline" class="w-6 h-6 text-gray-700" />
					<SignalSlashIcon v-else class="w-6 h-6 text-rose-500" />

					<ArrowPathIcon 
						class="w-6 h-6 text-gray-700" 
						:class="{ 'animate-spin': false }"
					/>
				</div>
			</div>
		</div>
		
		<div class="px-6 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
			<TransitionGroup
				enter-active-class="transition-all duration-300 ease-out"
				enter-from-class="opacity-0 translate-y-12"
				enter-to-class="opacity-100 translate-y-0"
				leave-active-class="transition-all duration-300 ease-in"
				leave-from-class="opacity-100 translate-y-0"
				leave-to-class="opacity-0 translate-y-12"
			>
				<PokemonItem
					v-for="(pokemon, index) in paginatedPokemons"
					:key="pokemon.id"
					:pokemon="pokemon"
					:index="index"
					:style="{ 'transition-delay': `${(index - (pokemonsMeta.page - 1) * 20) * 50}ms` }"
					@click="selectPokemon(pokemon)"
				/>
			</TransitionGroup>
		</div>

		<div 
			v-if="pokemonsLoading"
			class="mt-4 "
		>
			<p class="text-gray-400">
				Loading pokemons...
			</p>
		</div>
		
		<PokemonCard 
			v-if="selectedPokemon"
			v-model:open="isPokemonShowOpen"
			:pokemon="selectedPokemon"
			class="w-full h-full"
		/>
	</div>
</template>

<script setup>
	import { 
		SignalIcon,
		SignalSlashIcon,
		ArrowPathIcon,
	} from '@heroicons/vue/24/outline';

	import { 
		PokemonItem,
		PokemonCard,
	} from './components/pokemons';

	import { ref, computed } from 'vue';
	import { useNetwork } from './composables/useNetwork';
	import { useInfiniteScroll } from '@vueuse/core';

	import { getPokemons as apiGetPokemons } from '/src/utils/pokemon.js';
	

	// network
	const { isOnline } = useNetwork();

	// pokemons
	const pokemons = ref([]);
	const pokemonsMeta = ref({ page: 0 });
	const pokemonsLoading = ref(false);

	const paginatedPokemons = computed(() => {
		return pokemons.value.slice(0, pokemonsMeta.value?.page * 20);
	});

	const pokemonsCount = computed(() => {
		return isOnline.value ? pokemonsMeta.value?.count : pokemons.value?.length;
	});

	async function getPokemons(page = 1) {
		if (!isOnline.value) {
			return;
		}

		try {
			pokemonsLoading.value = true;
			const { data, meta } = await apiGetPokemons(page);
	
			data.forEach((pokemon) => {
				// save pokemon to DB
				savePokemonOnDB(pokemon);
	
				const index = pokemons.value.findIndex(p => p.id === pokemon.id);
				if (index >= 0) {
					// console.log('updating pokemon on array');
					pokemons.value[index] = pokemon;
					return;
				}
	
				pokemons.value.push(pokemon);
			});
	
			// meta
			pokemonsMeta.value = {
				...meta,
				page,
			};
		} catch (error) {
			console.error(error);
		} finally {
			pokemonsLoading.value = false;
		}
	}

	// infinite scroll
	const pokemonsList = ref();
	useInfiniteScroll(
		pokemonsList,
		() => {
			if (pokemonsMeta.value?.page * 20 >= pokemonsCount.value) {
				return;
			}

			pokemonsMeta.value.page += 1;
			getPokemons(pokemonsMeta.value.page);
		},
		{ 
			distance: 0, 
			interval: 500,
		},
	);

	// active pokemon
	const isPokemonShowOpen = ref(false);
	const selectedPokemon = ref();

	function selectPokemon(pokemon) {
		selectedPokemon.value = pokemon;
		isPokemonShowOpen.value = true;
	}

	// database
	const database = ref();
	async function getDatabase() {
		return new Promise((resolve, reject) => {
			const db = window.indexedDB.open('pokedex', 1);
	
			db.onerror = (event) => {
				console.error('db error: ', event);
				reject('db error: ', event);
			};
	
			db.onsuccess = (event) => {
				console.log('db success: ', event.target.result);
				resolve(event.target.result);
			};
	
			db.onupgradeneeded = (event) => {
				console.log('db upgrade needed: ', event.target.result);
				// event.target.result.deleteObjectStore('pokemons');
				event.target.result.createObjectStore('pokemons', {
					keyPath: 'id',
				});
			};
		});
		
	}

	// pokemon database
	async function getPokemonsFromDB() {
		return new Promise((resolve, reject) => {
			if (!database.value) {
				reject('db not ready');
			}
	
			try {
				database.value
					.transaction('pokemons')
					.objectStore('pokemons')
					.getAll()
					.onsuccess = (event) => {
						console.log('pokemons from db: ', event.target.result);
						resolve(event.target.result);
					}
				;
			} catch (error) {
				console.error(error);
			}
		});
	}

	async function savePokemonOnDB(pokemon) {
		return new Promise((resolve, reject) => {
			if (!database.value) {
				reject('db not ready');
			}
	
			console.log('saving pokemon in BD: ', pokemon.name);
			database.value
				.transaction('pokemons', 'readwrite')
				.objectStore('pokemons')
				.put({ ...pokemon })
				.onsuccess = () => {
					resolve();
				}
			;
		});
	}

	async function initDatabase() {
		database.value = await getDatabase();
		pokemons.value = await getPokemonsFromDB();
	}

	initDatabase();
</script>

