
-- DROP DATABASE `starlight` ;
CREATE DATABASE `starlight`;
USE `starlight`;

DROP TABLE IF EXISTS `usuarios`;
use `starlight`;
CREATE TABLE usuarios (
  id varchar(200) primary key,
  nome varchar(255) NOT NULL,
  usuario varchar(50) NOT NULL,
  email varchar(60) NOT NULL,
  senha varchar(200) NOT NULL,
  id_tipo_usuario int not null default '1'
);

  DROP TABLE IF EXISTS `noticia`;
    
    CREATE TABLE noticia (
  id_noticia varchar(200) primary key,
  titulo_noticia varchar(255),
  descricao_noticia varchar(255),
  data_noticia varchar (60),
  situacao_noticia varchar (60)
);

create table `tipo_usuario` (
	id_tipo_usuario int not null auto_increment,
	tipo_usuario varchar (25) default null,
    inscricao_usuario varchar (155) default null,
    status_tipo_usuario int default '1',
    primary key (`id_tipo_usuario`)
    
);	



alter table usuarios
add constraint tipo_usuario
foreign key (`id_tipo_usuario`) references tipo_usuario(`id_tipo_usuario`);

INSERT INTO `starlight`.`tipo_usuario` (`id_tipo_usuario`, `tipo_usuario`, `inscricao_usuario`, `status_tipo_usuario`) VALUES ('1', 'cliente', 'usuario logado', '1');
INSERT INTO `starlight`.`tipo_usuario` (`id_tipo_usuario`, `tipo_usuario`, `inscricao_usuario`, `status_tipo_usuario`) VALUES ('2', 'vendedor', 'vendedor', '1');
INSERT INTO `starlight`.`tipo_usuario` (`id_tipo_usuario`, `tipo_usuario`, `inscricao_usuario`, `status_tipo_usuario`) VALUES ('3', 'adm', 'adm', '1');



  
