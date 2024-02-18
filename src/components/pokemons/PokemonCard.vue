<template>
    <Drawer v-slot="{ close }">
        <div
            class="h-full flex flex-col"
            :class="[pokemonTypeClass]"
        >
            <header class="px-6 py-4 flex items-center justify-between">
                <button @click="close">
                    <ArrowLeftIcon 
                        class="w-5 h-5 text-gray-50"
                    />
                </button>

                <button>
                    <HeartIcon 
                        class="w-5 h-5 text-gray-50"
                    />
                </button>
            </header>

            <div class="px-6 py-4 z-50">
                <div class="flex items-baseline justify-between">
                    <h2 class="text-3xl text-gray-50 font-bold first-letter:uppercase">
                        {{ pokemon.name }}
                    </h2>
                    
                    <h3 class="text-lg text-gray-50 font-bold">
                        #{{ pokemon.id.toString().padStart(3, '0') }}
                    </h3>
                </div>

                <div class="mt-2 flex items-center gap-x-1.5">
                    <div 
                        v-for="type in pokemon.types"
                        :key="type.name"
                        class="inline-block px-4 py-1 text-sm font-bold text-gray-100 bg-gray-100/20 rounded-full first-letter:uppercase"
                    >
                        {{ type.name }}
                    </div>
                </div>

                <div class="mt-6 -mx-6">
                    <div class="flex md:grid md:grid-cols-4 overflow-x-auto snap-x snap-mandatory scale-125">
                        <div class="flex-none w-full flex snap-center md:col-start-2">
                            <img 
                                :src="pokemon.sprites.front_default"
                                class="mx-auto aspect-square w-48"
                            />
                        </div>

                        <div class="flex-none w-full flex snap-center">
                            <img 
                                :src="pokemon.sprites.back_default"
                                class="mx-auto aspect-square w-48"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-1 min-h-0 px-6 bg-white rounded-t-2xl overflow-y-auto">
                <div class="relative">
                    <div class="sticky top-0 inset-x-0 pt-6 pb-4 bg-white/75 backdrop-blur-sm">
                        <h4 class="text-xl text-gray-700 font-bold">
                            About
                        </h4>
                    </div>

                    <table class="-mt-2 text-sm border-separate border-spacing-y-2">
                        <tr>
                            <td class="min-w-32">
                                <p class="text-gray-400">
                                    Height
                                </p>
                            </td>

                            <td>
                                <p class="text-gray-700 font-medium">
                                    {{ pokemon.height }}"
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p class="text-gray-400">
                                    Weight
                                </p>
                            </td>

                            <td>
                                <p class="text-gray-700 font-medium">
                                    {{ pokemon.weight }} lbs
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p class="text-gray-400">
                                    Abilities
                                </p>
                            </td>

                            <td>
                                <p
                                    v-for="ability in pokemon.abilities"
                                    :key="ability.name"
                                    class="group inline-block text-sm text-gray-700 font-medium first-letter:uppercase"
                                >
                                    {{ ability.name }}<span class="group-last:hidden">,&nbsp;</span>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p class="text-gray-400">
                                    Base experience
                                </p>
                            </td>

                            <td>
                                <p class="text-gray-700 font-medium">
                                    {{ pokemon.base_experience }} points
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="relative">
                    <div class="sticky top-0 inset-x-0 pt-6 pb-4 bg-white/75 backdrop-blur-sm">
                        <h4 class="text-xl text-gray-700 font-bold">
                            Base stats
                        </h4>
                    </div>

                    <table class="-mt-2 table-auto border-separate border-spacing-y-2 w-full text-sm">
                        <tr
                            v-for="stat in pokemon.stats"
                            :key="stat.name"
                        >
                            <td class="min-w-32 max-w-32">
                                <p class="text-gray-400 first-letter:uppercase">
                                    {{ stat.name }}
                                </p>
                            </td>

                            <td class="px-4 min-w-16 max-w-16">
                                <p class="text-gray-700 font-medium">
                                    {{ stat.base_stat }}
                                </p>
                            </td>

                            <td class="min-w-32">
                                <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        class="h-full rounded-full bg-green-500"
                                        :style="{ 'width': `${stat.base_stat}%` }"
                                    />
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="relative">
                    <div class="sticky top-0 inset-x-0 pt-6 pb-4 bg-white/75 backdrop-blur-sm">
                        <h4 class="text-xl text-gray-700 font-bold">
                            Moves
                        </h4>
                    </div>

                    <div class="grid grid-cols-3 gap-x-4 gap-y-2">
                        <div
                            v-for="move in pokemon.moves"
                            :key="move.name"
                            class="text-gray-500 text-sm first-letter:uppercase"
                        >
                            {{ move.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Drawer>
</template>

<script setup>
    import Drawer from '../drawer';
    import { 
		ArrowLeftIcon,
		HeartIcon,
	} from '@heroicons/vue/24/outline';

    import { computed } from 'vue';
    import { getPokemonTypeBg } from '/src/utils/pokemon.js';

    // props
    const props = defineProps({
        pokemon: {
            type: [Object, null],
            required: true,
        },
    });

    // emits
    const emit = defineEmits(['close']);

    const pokemonTypeClass = computed(() => {
        const type = props.pokemon.types[0];
        return getPokemonTypeBg(type);
    });
</script>