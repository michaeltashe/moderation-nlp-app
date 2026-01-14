<script lang="ts">
    import axios from "axios";
    import { fly } from "svelte/transition";

    interface Category {
        name: string;
        confidence: number;
    }

    let text = $state("");
    let loading = $state(false);
    let moderationCategories = $state<Category[]>([]);

    const instance = axios.create({
        baseURL: "http://localhost:8080",
        headers: { "Access-Control-Allow-Origin": "*" },
    });

    const runNLPApi = async () => {
        try {
            loading = true;
            console.log("runNLPApi for text:", text);
            const res = await instance.post("/nlp", { text: text });
            console.log("res", res);
            moderationCategories = res.data.moderationCategories;
            moderationCategories.sort((a, b) => b.confidence - a.confidence);
        } catch (err) {
        } finally {
            loading = false;
        }
    };
</script>

<div class="wrapper">
    <div class="container">
        <h1 class="text-center">
            How <span>UNMODERATED</span> are you?
        </h1>
        <div class="form-container">
            <textarea bind:value={text}></textarea>
            <button onclick={runNLPApi}>FIND OUT</button>
        </div>

        {#if loading}
            <div>Loading...</div>
        {/if}
        {#if moderationCategories.length > 0}<h2 class="text-center">
                Categories ({moderationCategories.length})
            </h2>{/if}
        <div class="grid">
            {#each moderationCategories as category, index (category)}
                <div
                    in:fly={{ y: 40, duration: 300, delay: index * 100 }}
                    class="category-card"
                    style={`background-color: rgba(150, 0, 0, ${category.confidence}`}
                >
                    {category.name}
                    <p>{(category.confidence * 100).toFixed(2)}%</p>
                </div>
            {/each}
        </div>
    </div>
</div>
<footer class="text-center">Made by Michael Ashe</footer>

<style>
    .wrapper {
        width: 100vw;
        min-height: 100vh;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container {
        width: 1000px;
        margin: 32px 0;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 16px;
    }

    @media screen and (max-width: 1020px) {
        .container {
            width: 90%;
            margin: 0 auto;
        }

        .grid {
            grid-template-columns: 1fr 1fr 1fr;
        }
    }

    @media screen and (max-width: 600px) {
        .grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media screen and (max-width: 300px) {
        .container {
            width: 95%;
            margin: 0 auto;
        }

        .grid {
            grid-template-columns: 1fr;
        }
    }

    .text-center {
        text-align: center;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    textarea {
        padding: 12px;
        font-size: 1.125rem;
        border: 3px solid rgba(200, 0, 0, 0.8);
        border-radius: 8px;
        background: none;
        color: rgba(255, 255, 255, 1);
    }

    textarea:focus {
        outline: 1px solid rgba(200, 0, 0, 0.8);
    }

    button {
        width: 100%;
        background-color: rgba(150, 0, 0, 1);
        padding: 12px;
        color: white;
        border: none;
        font-size: 1.25rem;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
    }

    .category-card {
        padding: 16px;
        border-radius: 8px;
        border: 1px solid hsl(195 5.2% 30%);
    }

    footer {
        color: hsl(195 5.2% 30%);
        padding: 16px;
    }

    h1 {
        margin-bottom: 8px;
    }

    h2 {
        margin-bottom: 8px;
        margin-top: 24px;
    }
</style>
