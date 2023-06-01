<template>
    <h1>Home page</h1>
    <RouterLink to="/login">login</RouterLink>
    <RouterLink to="/register">register</RouterLink>
    <div class="container">
        <div class="row">
            <div class="item" style="background-color: var(--clr-neutral-100)"></div>
            <div class="item" style="background-color: var(--clr-neutral-300)"></div>
            <div class="item" style="background-color: var(--clr-neutral-500)"></div>
            <div class="item" style="background-color: var(--clr-neutral-700)"></div>
            <div class="item" style="background-color: var(--clr-neutral-900)"></div>
        </div>
        <div class="row">
            <div class="item" style="background-color: var(--clr-primary-100)"></div>
            <div class="item" style="background-color: var(--clr-primary-300)"></div>
            <div class="item" style="background-color: var(--clr-primary-500)"></div>
            <div class="item" style="background-color: var(--clr-primary-700)"></div>
            <div class="item" style="background-color: var(--clr-primary-900)"></div>
        </div>
        <div class="row">
            <div class="item" style="background-color: var(--clr-success-100)"></div>
            <div class="item" style="background-color: var(--clr-success-300)"></div>
            <div class="item" style="background-color: var(--clr-success-500)"></div>
            <div class="item" style="background-color: var(--clr-success-700)"></div>
            <div class="item" style="background-color: var(--clr-success-900)"></div>
        </div>
        <div class="row">
            <div class="item" style="background-color: var(--clr-warning-100)"></div>
            <div class="item" style="background-color: var(--clr-warning-300)"></div>
            <div class="item" style="background-color: var(--clr-warning-500)"></div>
            <div class="item" style="background-color: var(--clr-warning-700)"></div>
            <div class="item" style="background-color: var(--clr-warning-900)"></div>
        </div>
        <div class="row">
            <div class="item" style="background-color: var(--clr-error-100)"></div>
            <div class="item" style="background-color: var(--clr-error-300)"></div>
            <div class="item" style="background-color: var(--clr-error-500)"></div>
            <div class="item" style="background-color: var(--clr-error-700)"></div>
            <div class="item" style="background-color: var(--clr-error-900)"></div>
        </div>
        <div class="row">
            <div class="item" style="background-color: var(--clr-info-100)"></div>
            <div class="item" style="background-color: var(--clr-info-300)"></div>
            <div class="item" style="background-color: var(--clr-info-500)"></div>
            <div class="item" style="background-color: var(--clr-info-700)"></div>
            <div class="item" style="background-color: var(--clr-info-900)"></div>
        </div>
    </div>
</template>

<script></script>

<style scoped>
.container {
    display: flex;
    height: 30rem;
    justify-content: center;
    align-items: center;
    gap: 0.1rem;
    /* filter: blur(20px); */
}
.row {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 15%;
    gap: 0.1rem;
}
.item {
    display: flex;
    height: 3rem;
    border-radius: 4px;
}
</style>
