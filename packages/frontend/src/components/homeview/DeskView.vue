<script lang="ts" setup></script>
<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">People</h1>
      <button
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
      >
        Add Cards
      </button>
    </div>
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="rounded-lg border text-card-foreground shadow-sm bg-[#E9D5FF] text-center py-4" data-v0-t="card">
        <div class="text-2xl font-bold">0</div>
        <div class="text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="inline-block mr-1 -mt-1"
          >
            <path
              d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
            ></path>
            <path d="M5 3v4"></path>
            <path d="M19 17v4"></path>
            <path d="M3 5h4"></path>
            <path d="M17 19h4"></path></svg
          >{" "} New
        </div>
      </div>
      <div class="rounded-lg border text-card-foreground shadow-sm bg-[#FFE4E6] text-center py-4" data-v0-t="card">
        <div class="text-2xl font-bold">0</div>
        <div class="text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="inline-block mr-1 -mt-1"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg
          >{" "} Learning
        </div>
      </div>
      <div class="rounded-lg border text-card-foreground shadow-sm bg-[#C7D2FE] text-center py-4" data-v0-t="card">
        <div class="text-2xl font-bold">2</div>
        <div class="text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="inline-block mr-1 -mt-1"
          >
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="m9 12 2 2 4-4"></path></svg
          >{" "} Review
        </div>
      </div>
    </div>
    <button
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full bg-[#22C55E]"
    >
      Learn
    </button>
    <div class="flex justify-between items-center mt-6 mb-4">
      <div dir="ltr" data-orientation="horizontal">
        <div class="flex space-x-4">
          <div class="font-medium text-sm">Notebook</div>
          <div class="font-medium text-sm">Subdecks</div>
        </div>
      </div>
      <div class="flex space-x-2">
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Custom
        </button>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-lg"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4">
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4" data-v0-t="card">
        <div class="text-lg">ád</div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4" data-v0-t="card">
        <div class="text-lg">áda</div>
      </div>
    </div>
  </div>
</template>
