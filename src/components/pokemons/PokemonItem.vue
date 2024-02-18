<template>
    <button 
        class="px-5 py-2 text-left bg-gradient-to-tr rounded-xl focus:outline-none focus:ring-2 ring-blue-500 ring-offset-2 shadow-sm"
        :class="[pokemonTypeClass]"
    >
        <h3 class="text-lg font-bold text-gray-900 opacity-20 text-right">
            #{{ pokemon.id.toString().padStart(3, '0') }}
        </h3>
        
        <h2 class="font-bold text-gray-50 leading-4 first-letter:uppercase">
            {{ pokemon.name }}
        </h2>

        <div class="grid grid-cols-2 gap-x-2">
            <div class="mt-2 space-y-1.5">
                <div 
                    v-for="type in pokemon.types"
                    :key="type.name"
                    class="inline-block px-3 py-0.5 text-xs font-bold text-gray-100 bg-gray-100/20 rounded-full first-letter:uppercase"
                >
                    {{ type.name }}
                </div>
            </div>

            <div class="">
                <img 
                    :src="pokemon.sprites.front_default" 
                    class="ml-3 scale-150"
                />
            </div>
        </div>
    </button>
</template>

<script setup>
    import { computed } from 'vue';
    import { getPokemonTypeBg } from '/src/utils/pokemon.js';

    const props = defineProps({
        pokemon: {
            type: Object,
            required: true,
        },
    });

    const pokemonTypeClass = computed(() => {
        const type = props.pokemon.types[0];
        return getPokemonTypeBg(type);
    });
</script>