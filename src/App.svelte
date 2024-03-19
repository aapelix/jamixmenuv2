<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  let ready = false;

  let con = false;

  if (localStorage.getItem("con") != null) {
    con = true;
  } else {
    localStorage.setItem("con", "true");
  }

  let auth = false;
  let why = false;

  let input = "";

  let selectedDay = 1;

  let foodData = [];
  let foodMenu = fetchMenu();

  async function fetchMenu() {
    let response = await fetch(
      "https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/96574/115?lang=fi"
    );

    let responsejson = await response.json();
    let responseMenu = responsejson[0].menuTypes[0].menus[0];

    let day1 = responseMenu.days[0];
    let day2 = responseMenu.days[1];
    let day3 = responseMenu.days[2];
    let day4 = responseMenu.days[3];
    let day5 = responseMenu.days[4];

    foodData = [
      { day: day1.date, menu: day1.mealoptions[0].menuItems },
      { day: day2.date, menu: day2.mealoptions[0].menuItems },
      { day: day3.date, menu: day3.mealoptions[0].menuItems },
      { day: day4.date, menu: day4.mealoptions[0].menuItems },
      { day: day5.date, menu: day5.mealoptions[0].menuItems },
    ];

    return foodData;
  }

  /**
   * @param {string} dateString
   */
  function formatDate(dateString) {
    let year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6);
    let day = dateString.substring(6, 8);

    return `${day}.${month}.${year}`;
  }

  function inputChange() {
    if (input == "skillissue") {
      auth = true;
      localStorage.setItem("auth", "true");
    }
  }

  onMount(() => {
    ready = true;

    if (localStorage.getItem("auth") == "true") {
      auth = true;
    }
  });
</script>

<main>
  {#if auth}
    <div class="w-screen flex justify-center items-center h-screen flex-col">
      {#if ready && con}
        <img
          class="w-96 h-auto -translate-y-80"
          src="/jamix.png"
          alt=""
          in:fly={{ y: 144, duration: 4000, opacity: 100 }}
        />
      {:else if ready}
        <img
          class="w-96 h-auto -translate-y-44"
          src="/jamix.png"
          alt=""
          in:fly={{ y: 40, duration: 1000 }}
        />
      {/if}
      {#if !con}
        <button
          class="text-xl bg-[#0b0b0b] p-20 py-5 rounded-3xl hover:scale-110 duration-150 absolute"
          on:click={() => (con = true)}
          out:fade={{ duration: 500 }}
        >
          Jatka
        </button>
      {/if}
      {#if con}
        {#await foodMenu}
          Loading menu
        {:then menu}
          <div class="absolute flex flex-row justify-center translate-y-24">
            <div
              class="bg-[#1b1b1b] hover:-translate-y-5 duration-300 px-20 rounded-md py-10 m-5 sm:hidden lg:block"
            >
              <h1 class="text-xl font-bold">
                {formatDate(`${menu[selectedDay - 1].day}`)}
              </h1>
              <ul>
                {#each menu[selectedDay - 1].menu as food}
                  <li style="">
                    {food.name}
                  </li>
                {/each}
              </ul>
            </div>

            <div
              class="bg-[#0b0b0b] hover:-translate-y-5 duration-300 px-20 rounded-md py-10 m-5 border-purple-800 border-2"
            >
              <h1 class="text-xl font-bold">
                {formatDate(`${menu[selectedDay].day}`)}
              </h1>
              <ul>
                {#each menu[selectedDay].menu as food}
                  <li style="">
                    {food.name}
                  </li>
                {/each}
              </ul>
            </div>

            <div
              class="bg-[#1b1b1b] hover:-translate-y-5 duration-300 px-20 rounded-md py-10 m-5 sm:hidden lg:block"
            >
              <h1 class="text-xl font-bold">
                {formatDate(`${menu[selectedDay + 1].day}`)}
              </h1>
              <ul>
                {#each menu[selectedDay + 1].menu as food}
                  <li style="">
                    {food.name}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/await}
      {/if}

      <input
        type="text"
        class="absolute bottom-10 p-2 rounded-md text-white placeholder-gray-400 w-[35rem] outline-none"
        placeholder="Haku..."
      />
    </div>
  {:else}
    <div
      class="absolute flex flex-col items-center w-full justify-center translate-y-24"
    >
      <h1 class="font-bold text-3xl m-5">Pääsykoodi:</h1>
      <input
        type="text"
        class="p-2 rounded-md text-white placeholder-gray-400 w-[35rem] outline-none"
        placeholder="Kirjoitappas pääsykoodi tähän"
        bind:value={input}
        on:change={() => inputChange()}
      />

      <button class="text-gray-400 mt-2" on:click={() => (why = true)}
        >Miksi tarvitsen pääsykoodin?</button
      >
    </div>
  {/if}

  {#if why}
    <div
      class="w-96 bg-[#080808] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 p-4 rounded-md"
    >
      <p class="text-gray-300">
        Tämä sivusto käyttää pääsykoodia, jotta vähennettäisiin random ihmisten
        pääsyä tänne. Tätä tehdään, koska tällä hetkellä et voi saada muita
        listoja kuin Kangasalan koulujen, joka johtaisi siihen, että kuka
        tahansa voisi selvittää kuka tämän nettisivun omistaa ja täten myös
        tietää että oletetettavasti hän asuu kaupungissa Kangasala.
        Pääsykoodilla myös vähennetään Jamixin APIn käyttämistä, jolloin se
        toimii paremmin ja nopeammin
      </p>
      <button
        class="bg-[#0a0a0a] absolute right-2 bottom-2"
        on:click={() => (why = false)}>X</button
      >
    </div>
  {/if}
</main>
