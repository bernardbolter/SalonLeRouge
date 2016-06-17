<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta name="description" content="Keywords">
    <meta name="author" content="Name">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="shortcut icon" href="<?php echo THEME_DIR; ?>/path/favicon.ico" />
    <link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name'); ?> RSS2 Feed" href="<?php bloginfo('rss2_url'); ?>" />
    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

    <link href="<?php bloginfo('template_directory'); ?>/style.css" rel="stylesheet">

    <title><?php wp_title(); ?> - <?php bloginfo( 'name' ); ?></title>

    <?php wp_head(); ?>

  </head>
<body <?php body_class(); ?>>
  <div hidden>
    <?php echo file_get_contents( get_template_directory_uri() . '/svg/defs.svg' ); ?>
  </div>
