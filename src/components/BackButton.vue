<template>
    <button class="btn btn-secondary mt-3" @click="goBack">Volver</button>
</template>

<script>
export default {
    name: 'BackButton',
    methods: {
        goBack() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                this.$router.push('/');
            }
        }
    }
};
</script>