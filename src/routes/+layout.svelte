<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon/favicon.ico" />
</svelte:head>

<div class="app-layout">
	<header class="main-header">
		<div class="main-header__container container">
			<a href="/"><h1>AitorTeca</h1></a>
			<nav class="menu">
				<ul>
					<li><a href="/library">Biblioteca</a></li>
				</ul>
			</nav>
		</div>
	</header>

	<main class="main-content">
		<div class="container">
			{@render children()}
		</div>
	</main>

	<footer class="main-footer">
		<div class="container">aitorlevi.com</div>
	</footer>

	<!-- chunk 3: <Alert /> y <Loader /> · chunk 4: aria-current del nav activo -->
</div>
