import { getClient } from '../../lib/sanity';
import { PortableText, imageBuilder } from '../../lib/sanity';
import ScrollContainer from 'react-indiana-drag-scroll';
import ModalImage from 'react-modal-image';
import { groq } from 'next-sanity';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import styles from '../../styles/home.module.scss';

export default function SingleNews({ locale, news }) {
  const { title, author, _createdAt, body, postGallery } = news[0];
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, Math.random() * 5000);
    }
  }, []);

  const returnClassName = classname => {
    if (locale === 'he') {
      return `${classname} ${styles.he}`;
    }
    return `${classname}`;
  };
  return (
    <div className={styles.singleNewsContainer}>
      <div className={returnClassName(styles.singleNewsContent)}>
        <h3 className={returnClassName(styles.pageTitle)} style={{ marginBottom: '0rem' }}>
          {title?.[locale]}
        </h3>
        <p className={returnClassName(styles.by)}>
          <span style={locale === 'he' ? { marginRight: '0rem' } : { marginLeft: '0rem' }}>
            {t('common:by')}
          </span>
          <span className={styles.blue}>{author}</span>
          <span>{t('common:on')}</span>
          <span className={styles.blue}>{moment(_createdAt).format('MMMM DD, YYYY')}</span>
        </p>
        <div className={returnClassName(styles.content)}>
          {body?.[locale] ? (
            <PortableText renderContainerOnSingleChild blocks={body[locale]} />
          ) : null}
        </div>

        {postGallery?.images?.length ? (
          <ScrollContainer
            className={styles.scrollContainer}
            style={{ display: 'flex', margin: '2rem 0rem' }}
            innerRef={scrollRef}>
            {postGallery?.images.map((img, index) => (
              <ModalImage
                className={styles.imgPreview}
                key={img._key}
                small={imageBuilder(img)}
                large={imageBuilder(img)}
                hideDownload
                hideZoom
              />
            ))}
          </ScrollContainer>
        ) : null}
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ locale, params }) => {
  const id = params.id;

  const queryNewsId = groq`
  *[_type == "post" && slug.current == "${id}"]`;

  const news = await getClient(false).fetch(queryNewsId);
  return {
    props: {
      news,
      locale
    }
  };
};
