<template>
    <router-view />
</template>

<script>
export default {
    mounted() {
        this.axios.interceptors.request.use((config) => {
            config.headers.Authorization = this.$cookie.getCookie("token");
            return config;
        });
    },
};
</script>

<style>
:root {
    --clr-primary-100: hsl(219, 64%, 89%);
    --clr-primary-300: hsl(229, 72%, 69%);
    --clr-primary-500: hsl(229, 72%, 50%);
    --clr-primary-700: hsl(229, 85%, 33%);
    --clr-primary-900: hsl(229, 89%, 21%);

    --clr-warning-100: hsl(39, 64%, 89%);
    --clr-warning-300: hsl(49, 72%, 69%);
    --clr-warning-500: hsl(49, 72%, 50%);
    --clr-warning-700: hsl(49, 85%, 33%);
    --clr-warning-900: hsl(49, 89%, 21%);

    --clr-error-100: hsl(352, 64%, 89%);
    --clr-error-300: hsl(2, 72%, 69%);
    --clr-error-500: hsl(2, 72%, 50%);
    --clr-error-700: hsl(2, 85%, 33%);
    --clr-error-900: hsl(2, 89%, 21%);

    --clr-success-100: hsl(120, 64%, 89%);
    --clr-success-300: hsl(130, 72%, 69%);
    --clr-success-500: hsl(130, 72%, 50%);
    --clr-success-700: hsl(130, 85%, 33%);
    --clr-success-900: hsl(130, 89%, 21%);

    --clr-info-100: hsl(268, 64%, 89%);
    --clr-info-300: hsl(278, 72%, 69%);
    --clr-info-500: hsl(278, 72%, 50%);
    --clr-info-700: hsl(278, 85%, 33%);
    --clr-info-900: hsl(278, 89%, 21%);

    --clr-neutral-100: hsl(0, 0%, 100%);
    --clr-neutral-300: hsl(235, 8%, 70%);
    --clr-neutral-500: hsl(230, 8%, 42%);
    --clr-neutral-700: hsl(232, 22%, 20%);
    --clr-neutral-900: hsl(233, 46%, 7%);

    font-family: "Lato", sans-serif;
    background-color: var(--clr-neutral-100);
    color: var(--clr-neutral-900);
}

/* Box sizing rules */
*,
*::before,
*::after {
    box-sizing: border-box;
}

/* Remove default margin */
* {
    margin: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
    list-style: none;
}

/* Set core root defaults */
html:focus-within {
    scroll-behavior: smooth;
}

html,
body,
#app {
    height: 100%;
}

/* Set core body defaults */
body {
    text-rendering: optimizeSpeed;
    line-height: 1.5;
}

a {
    color: var(--clr-primary-700);
    font-weight: 700;
    transition: filter 0.2s;
}
a:hover {
    filter: brightness(2);
}

/* A elements that don't have a class get default styles */
a:not([class]) {
    text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture,
svg {
    max-width: 100%;
    display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
    font: inherit;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
    html:focus-within {
        scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

@media (prefers-color-scheme: dark) {
    :root {
        background-color: var(--clr-neutral-700);
        color: var(--clr-neutral-100);
    }
    a {
        color: var(--clr-primary-300);
    }
}
</style>
