<template>
    <TransitionRoot 
        appear 
        :show="isOpen" 
        as="template"
    >
        <Dialog 
            as="div" 
            @close="closeDialog" 
            class="relative z-50"
        >
            <TransitionChild 
                as="template" 
                enter="duration-300 ease-out" 
                enter-from="opacity-0" 
                enter-to="opacity-100"
                leave="duration-200 ease-in" 
                leave-from="opacity-100" 
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <TransitionChild 
                as="template" 
                enter="duration-300 ease-out" 
                enter-from="translate-y-full"
                enter-to="translate-y-0" 
                leave="duration-200 ease-in" 
                leave-from="translate-y-0"
                leave-to="translate-y-full"
            >
                <DialogPanel class="fixed inset-0">
                    <slot 
                        :isOpen="isOpen"
                        :open="openDialog"
                        :close="closeDialog"
                    />
                </DialogPanel>
            </TransitionChild>
        </Dialog>
    </TransitionRoot>
</template>
  
<script setup>
    import {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogPanel,
        DialogTitle,
    } from '@headlessui/vue';
    import { ref, watchEffect } from 'vue';

    // props
    const props = defineProps({
        open: {
            typre: Boolean,
            default: false,
        },
    });

    // emits
    const emit = defineEmits(['update:open']);

    // dialog
    const isOpen = ref(props.open);
    watchEffect(() => isOpen.value = props.open);

    function closeDialog() {
        emit('update:open', false);
    }
    function openDialog() {
        emit('update:open', true);
    }
</script>
  